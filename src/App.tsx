import { useState } from "react";
import { useStreamers } from "./hooks/useStreamers";
import Players from "./components/Players";
import Chatroom from "./components/Chatroom";
import AddStreamerModal from "./components/AddStreamerModal";

function App() {
  const {
    streamers,
    chatroomStreamer,
    addStreamer,
    deleteStreamer,
    changeChatroomStreamer,
    modChannels,
    toggleModChannel,
  } = useStreamers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalOpen = () => setIsModalOpen((v) => !v);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#111827] font-semibold text-white">
      <div className="flex flex-1 min-h-0">
        <div
          className={`flex-1 min-w-0 h-full ${
            streamers.length > 0
              ? "invisible w-0 sm:visible md:w-[calc(100%-400px)]"
              : "w-full"
          }`}
        >
          {streamers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#adadb8]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-12 h-14"
                  viewBox="0 0 225.13 264.21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <style>{`.kl1{fill:#79da5d}.kl2{fill:#52fa18}`}</style>
                  </defs>
                  <path className="kl1" d="M224,88.11V.04c.36,0,1.01.08,1.01,1.08v85.85c0,.96-.67,1.12-1.01,1.12Z"/>
                  <path className="kl1" d="M224,264.13v-85.92c0-.81.52-1.43,1.01-1.02,0,6.77.66,86.94-1.01,86.94Z"/>
                  <path className="kl1" d="M195.99,111.1v-22.11c0-.9.69-.84,1.14-.85l-.03,26.85c0,1.08-.13,2.17-.99,2.16l-28.24-.44"/>
                  <path className="kl1" d="M197.18,176.05c-.37,0-1.19.02-1.19-1v-26.83c-9.62-1.2-19.07,1.6-27.04-1.4l28.03.26.2,28.97Z"/>
                  <path className="kl1" d="M111.81,58.88c0,.43.23,1.21-.73,1.21h-26.11c-.86,0-1.13-.86-.88-1.19,9.23.23,18.49.29,27.72-.02Z"/>
                  <path className="kl1" d="M139.91,235.2l-26.92-.14c-.9,0-.99-.64-.99-1l27.02-.02c1.01,0,.89.84.89,1.17Z"/>
                  <path className="kl1" d="M111.84,204.68c-9.17.56-18.49.78-27.93-.1,9.25-.81,17.84-1,27.93.1Z"/>
                  <polygon className="kl2" points="83.85 .05 84.1 58.9 111.81 58.88 112.07 29.07 139.87 29.05 140.43 0 225.13 .04 225.01 88.11 197.13 88.14 197.18 118.02 169.01 118.31 168.95 146.82 196.98 147.08 197.18 176.05 225.13 176.05 224 264.13 140.22 264.1 139.91 235.2 112 235.2 111.83 206.07 83.92 206.03 83.91 264.21 0 264.12 0 0 83.85 .05"/>
                </svg>
                <span
                  className="text-white text-5xl tracking-wide"
                  style={{ fontFamily: '"Kick", sans-serif' }}
                >
                  KickScreen
                </span>
              </div>
              <p className="text-sm text-[#6b7280]">Çoklu Yayın İzleyici</p>
              <div className="h-4" />
              <p className="text-lg">Henüz yayın eklenmedi</p>
              <button
                onClick={toggleModalOpen}
                className="px-5 py-2 rounded-lg bg-[#53fc18] text-black font-medium hover:bg-[#45d615] transition-colors cursor-pointer"
              >
                + Yayıncı Ekle
              </button>
              <div className="flex gap-3 mt-6 text-xs text-[#6b7280]">
                <a href="/hakkinda.html" target="_blank" className="hover:text-white transition-colors">Hakkında</a>
                <span>·</span>
                <a href="/gizlilik.html" target="_blank" className="hover:text-white transition-colors">Gizlilik</a>
                <span>·</span>
                <a href="https://github.com/kayapater/kickscreen" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                <span>·</span>
                <a href="https://x.com/kayapater" target="_blank" className="hover:text-white transition-colors">İletişim</a>
              </div>
              <p className="mt-4 text-[10px] text-[#4b5563]">Kick.com ile bağlantılı resmi bir hizmet değildir.</p>
            </div>
          ) : (
            <Players streamers={streamers} onDeleteStreamer={deleteStreamer} />
          )}
        </div>

        {streamers.length > 0 && (
          <div className="h-full w-full md:w-[400px]">
            <Chatroom
              streamers={streamers}
              chatroomStreamer={chatroomStreamer}
              changeChatroomStreamer={changeChatroomStreamer}
              toggleModalOpen={toggleModalOpen}
              deleteStreamer={deleteStreamer}
              modChannels={modChannels}
              toggleModChannel={toggleModChannel}
            />
          </div>
        )}
      </div>

      <AddStreamerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addStreamer}
      />
    </div>
  );
}

export default App;
