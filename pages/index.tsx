import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Harry Mack");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const prompt = `Generate a freestyle rap with the words "${bio}" in the style of rapper ${vibe}.
  // Limit to 10-15 words max but always finish started sentence, use multisyllabic rhymes and add "[BREAK]" after each words that you will use to rhyme. Never add "[BREAK]" at the end of the rap`;

  const prompt = `Act as a rapper.
  You will come up with meaningful lyrics about "${bio}" in the style of "${vibe}".
  Use codes of freestyle rap.
  Use multisyllabic rhymes.
  Use "${bio}" at the end of the sentence to rhyme with.
  Limit results to 4 sentences.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Freestyler AI - Rap Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {/* <main className="flex flex-1 w-full flex-col items-center justify-center text-center"> */}
      <main className="flex flex-1 w-full flex-col items-center text-center">
        {/* <h1 className="sm:text-4xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate Freestyle Rap using chatGPT
        </h1> */}
        {/* <p className="text-slate-500 mt-5">47,118 bios generated so far.</p> */}
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              {/* Throw me 3 words to inspire my freestyle{" "}
              <span className="text-slate-500">
                (or leave it empty )
              </span>
              . */}
              Throw words or topics to inspire this freestyle
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={1}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Flabbergasted, Experiement, Rainbow."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your favorite rapper</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              You ready? Let's get it &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-2xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Hey yo listen, it's {vibe}!
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .split("\n")
                  .filter((generatedBio) => !generatedBio.includes('Verse'))
                  .filter((generatedBio) => !generatedBio.includes('Chorus'))
                  .filter((generatedBio) => !generatedBio.includes(':'))
                  .filter((generatedBio) => generatedBio.split(' ').length > 2)
                  .slice(0, 8)
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Freestyle copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
