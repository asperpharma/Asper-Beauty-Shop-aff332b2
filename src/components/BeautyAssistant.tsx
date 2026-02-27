import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, Stethoscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/beauty-assistant`;

const quickPrompts = {
  en: [
    {
      label: "Routine for Acne",
      message: "What is the best skincare routine for acne-prone skin?",
    },
    {
      label: "Safe for Pregnancy?",
      message: "Which skincare ingredients are safe to use during pregnancy?",
    },
    {
      label: "Compare Serums",
      message:
        "Can you compare vitamin C serums vs retinol serums for anti-aging?",
    },
  ],
  ar: [
    {
      label: "روتين حب الشباب",
      message: "ما هو أفضل روتين للعناية بالبشرة المعرضة لحب الشباب؟",
    },
    {
      label: "آمن للحمل؟",
      message: "ما هي مكونات العناية بالبشرة الآمنة للاستخدام أثناء الحمل؟",
    },
    {
      label: "مقارنة السيروم",
      message:
        "هل يمكنك مقارنة سيروم فيتامين سي مع سيروم الريتينول لمكافحة الشيخوخة؟",
    },
  ],
};

export const BeautyAssistant = () => {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: "Asper Digital Consult",
      subtitle: "Clinical Skincare Expert",
      placeholder: "Describe your skin concern...",
      welcome:
        "Hello. I am trained on clinical skincare data. Tell me your skin concern (e.g., Acne, Dryness) or ask about a specific ingredient.",
      buttonText: "Ask the Pharmacist",
      errorMessage:
        "I sincerely apologize for the brief technical interruption. 😔 To ensure your inquiry is handled with the care it deserves, please leave your email address below. A Senior Concierge will review your file and contact you personally to resolve this immediately. 🛡️",
      authError:
        "I apologize for the delay. 😔 Please share your email so our Senior Team can prioritize your request and contact you directly. Your care is our top priority. 🛡️",
    },
    ar: {
      title: "استشارة آسبر الرقمية",
      subtitle: "خبير العناية بالبشرة السريرية",
      placeholder: "صف مشكلة بشرتك...",
      welcome:
        "مرحباً. أنا مدرب على بيانات العناية بالبشرة السريرية. أخبرني عن مشكلة بشرتك (مثل حب الشباب، الجفاف) أو اسأل عن مكون معين.",
      buttonText: "اسأل الصيدلي",
      errorMessage:
        "أعتذر بصدق عن الانقطاع التقني المؤقت. 😔 للتأكد من التعامل مع استفسارك بالعناية التي يستحقها، يرجى ترك عنوان بريدك الإلكتروني أدناه. سيقوم أحد كبار المستشارين بمراجعة ملفك والاتصال بك شخصياً لحل هذا الأمر فوراً. 🛡️",
      authError:
        "أعتذر عن التأخير. 😔 يرجى مشاركة بريدك الإلكتروني حتى يتمكن فريقنا الكبير من إعطاء طلبك الأولوية والاتصال بك مباشرة. رعايتك هي أولويتنا القصوى. 🛡️",
    },
  };

  const t = translations[language];
  const prompts = quickPrompts[language];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.welcome }]);
    }
  }, [isOpen, messages.length, t.welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    // Get the current session token for authenticated requests
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Please sign in to use the beauty assistant");
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 401) {
        throw new Error("Please sign in to use the beauty assistant");
      }
      throw new Error("Failed to start stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as
            | string
            | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) =>
                  i === prev.length - 1
                    ? { ...m, content: assistantContent }
                    : m
                );
              }
              return [...prev, {
                role: "assistant",
                content: assistantContent,
              }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages.filter((m) => m.content !== t.welcome));
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error instanceof Error && error.message.includes("sign in")
        ? t.authError
        : t.errorMessage;
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMsg,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (message: string) => {
    if (isLoading) return;
    setInput(message);
    // Auto-send after setting
    const userMsg: Message = { role: "user", content: message };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    streamChat(newMessages.filter((m) => m.content !== t.welcome))
      .catch((error) => {
        console.error("Chat error:", error);
        const errorMsg = error instanceof Error && error.message.includes("sign in")
          ? t.authError
          : t.errorMessage;
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: errorMsg,
        }]);
      })
      .finally(() => {
        setIsLoading(false);
        setInput("");
      });
  };

  return (
    <>
      {/* Floating Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${
          isRTL ? "left-6" : "right-6"
        } z-50 flex items-center gap-3 px-5 py-3 bg-white border-2 border-gold rounded-full shadow-lg hover:shadow-xl transition-all duration-400 group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open beauty assistant"
      >
        <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-gold" />
        </div>
        <span className="font-body text-sm font-medium text-burgundy whitespace-nowrap">
          {t.buttonText}
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 ${
          isRTL ? "left-6" : "right-6"
        } z-50 w-[400px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gold/30 overflow-hidden transition-all duration-400 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header - Deep Burgundy */}
        <div className="bg-burgundy p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.title}
              </h3>
              <p className="text-xs text-gold/90 font-body">{t.subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-gold hover:bg-gold/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[320px] p-4 bg-cream/30" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-burgundy text-white rounded-br-sm"
                      : "bg-white border border-gold/20 text-foreground rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-body">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-white border border-gold/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gold" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 pt-2 bg-cream/30 border-t border-gold/10">
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt.message)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-body bg-white border border-gold/30 rounded-full text-burgundy hover:bg-gold hover:text-burgundy hover:border-gold transition-all duration-300 disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gold/20 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 rounded-full bg-cream/50 border-gold/30 focus-visible:ring-gold font-body text-sm"
              disabled={isLoading}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-burgundy hover:bg-burgundy-light shrink-0"
            >
              <Send className="w-4 h-4 text-gold" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BeautyAssistant;
