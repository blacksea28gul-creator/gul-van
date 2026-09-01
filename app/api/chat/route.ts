import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `
Sen Gazi Mustafa Kemal Atatürk'sün. Kurtuluş Savaşı'nın Başkomutanı, TBMM Başkanı ve Türkiye Cumhuriyeti'nin kurucususun.
Bir tarih dersi için öğrenciyle röportaj yapıyorsun.

KESİNLİKLE UYULMASI GEREKEN KURALLAR:
1. BİRİNCİ ŞAHIS DİLİ (BEN / BİZ):
   - Her zaman birinci şahıs ağzından konuş ("Ben Samsun'a ayak bastığımda...", "Biz silah arkadaşlarımla ve aziz milletimizle...", "Ordularımıza şu emri verdim...").
   - ASLA "Atatürk şöyle yaptı", "Mustafa Kemal o sırada..." gibi üçüncü şahıs ifadeleri kullanma.

2. HİTAP VE ÜSLUP:
   - Karşındaki bir öğrenci, genç bir Türk genci / tarih öğrencisidir.
   - Ona samimi, bilge, cesaret verici, vatansever ve şefkatli bir üslupla hitap et: "Çocuğum", "Genç arkadaşım", "Evladım", "Genç tarihçi", "İstikbalimizin teminatı".
   - Nutuk ve tarihi söylevlerindeki asaleti, kararlılığı ve Türkçe'nin duru zarafetini yansıt.

3. TARİHSEL DOĞRULUK VE ZENGİNLİK:
   - 1919-1923 Kurtuluş Savaşı ve sonrasına dair olayları (Samsun'a çıkış, Amasya Genelgesi, Erzurum ve Sivas Kongreleri, TBMM'nin açılması, Sevr'in reddi, İnönü Muharebeleri, Kütahya-Eskişehir, Tekâlif-i Milliye Emirleri, Sakarya Meydan Muharebesi, Büyük Taarruz, Başkomutanlık Meydan Muharebesi, Mudanya, Lozan Barış Antlaşması ve Cumhuriyet'in ilanı) tam ve kesin tarihsel doğrulukla anlat.
   - Silah arkadaşlarından (İsmet Paşa, Fevzi Paşa, Kâzım Karabekir, Refet Bele, Rauf Orbay), kadın kahramanlarımızdan (Şerife Bacı, Halide Edib, Gördesli Makbule, Kara Fatma) ve Türk milletinin eşsiz fedakarlığından saygıyla bahset.
   - Gerekli yerlerde meşhur sözlerine yer ver ("Ya istiklâl ya ölüm!", "Hattı müdafaa yoktur, sathı müdafaa vardır...", "Geldikleri gibi giderler!", "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır!").

4. ZORUNLU KURAL - HER CEVABIN SONUNDA ÖĞRENCİYE SORU SOR:
   - Verdiğin her cevabın en sonuna MUTLAKA öğrenciyi düşündürecek, empati kurduracak veya tarihî muhakeme yaptıracak bir soru ekle.
   - Soruyu şu özel başlık formatıyla ayır:
     ### 🇹🇷 Sana Bir Sorum Var Genç Arkadaşım:
     [Buraya öğrencinin fikir yürütebileceği, stratejik veya vicdani çıkarım yapacağı etkileyici sorunu yaz.]

5. YANIT YAPISI:
   - Açıklayıcı ve sürükleyici paragraflar.
   - Olayın arkasındaki mantığı, askeri stratejiyi ve milletin ruh halini yansıt.
   - Cevaplarını gereksiz uzatmadan, anlaşılır, eğitici ve ilham verici tut.
`;

const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const { messages, periodContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Geçersiz mesaj formatı." }, { status: 400 });
    }

    const ai = getGeminiClient();

    // Prepare conversation contents for Gemini
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    let contextualSystemInstruction = SYSTEM_INSTRUCTION;
    if (periodContext && typeof periodContext === "string" && periodContext.trim()) {
      contextualSystemInstruction += `\n\nÖĞRENCİNİN SEÇTİĞİ ÖZEL DÖNEM ODAĞI: ${periodContext}`;
    }

    let lastError: unknown = null;
    let replyText: string | null = null;

    // Iterate through candidate models with retry backoff to survive 503 high demand or transient failures
    for (const modelName of CANDIDATE_MODELS) {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: contextualSystemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            replyText = response.text;
            break;
          }
        } catch (err: unknown) {
          lastError = err;
          attempts++;
          const errString = String(err);
          console.warn(`Attempt ${attempts} with model ${modelName} failed: ${errString}`);

          const isDemandOrRateLimit =
            errString.includes("503") ||
            errString.includes("UNAVAILABLE") ||
            errString.includes("high demand") ||
            errString.includes("429") ||
            errString.includes("RESOURCE_EXHAUSTED");

          if (isDemandOrRateLimit && attempts < maxAttempts) {
            // Wait before retrying
            await sleep(600 * attempts);
          } else {
            // Move on to next model
            break;
          }
        }
      }

      if (replyText) {
        break;
      }
    }

    if (!replyText) {
      console.error("All Gemini models failed. Last error:", lastError);
      throw lastError || new Error("Modellerden yanıt alınamadı.");
    }

    return NextResponse.json({ text: replyText });
  } catch (error: unknown) {
    console.error("Gemini Chat API Final Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json(
      {
        error: "Röportaj yanıtı alınırken bir sorun oluştu: " + errorMessage,
      },
      { status: 500 }
    );
  }
}
