import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppShell } from "../components/app-shell";
import { UserListBooks } from "../components/book/list-book";
const quotes = [
  "Learn First, To Lead Others"
];

export function HomePage() {
  const [currentQuote, setCurrentQuote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const quote = quotes[quoteIndex];
    let timeoutId: number | undefined;

    if (isTyping) {
      let charIndex = 0;
      setCurrentQuote("");

      const typeNextChar = () => {
        if (charIndex < quote.length) {
          setCurrentQuote(quote.substring(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
        }
      };

      timeoutId = setTimeout(typeNextChar, 50);
    } else {
      // Wait for 5 seconds before starting to type the next quote
      timeoutId = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsTyping(true);
      }, 60000);
    }
    //SA
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [quoteIndex, isTyping]);

  return (
    <AppShell>
      <div className="relative w-full max-w-2xl mx-auto mt-0 pt-0 px-6">
        <div className="min-h-[6rem] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-amber-900 mb-8">
              Welcome to Book Review App
            </h1>
            <p
              className="text-2xl font-medium text-amber-700 text-center relative"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <b>"</b>
              {currentQuote}
              <b>"</b>
              <span
                className={`inline-block w-0.5 h-6 ml-1 bg-amber-700 ${
                  isTyping ? "animate-pulse" : "opacity-0"
                }`}
              ></span>
            </p>
          </div>
        </div>
      </div>

      <UserListBooks />

      <Toaster />
    </AppShell>
  );
}

export default HomePage;
