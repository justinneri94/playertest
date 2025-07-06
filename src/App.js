
import React, { useState, useRef } from "react";
import vinylArt from "../public/assets/vinyl.jpg";
import mp3File from "../public/assets/jhene.mp3";

const tracks = [
  {
    title: "Jhene.mp3",
    src: mp3File,
    duration: "55:02",
    artist: "Unknown",
    art: vinylArt,
  },
  // You can add more tracks here, just duplicate the object and change the name/src
];

function Dock({ onOpen, isOpen }) {
  return (
    <div style={{
      position: 'fixed',
      left: 30,
      bottom: 30,
      zIndex: 10
    }}>
      {!isOpen &&
        <button onClick={onOpen}
          style={{
            border: "2px solid #222",
            borderRadius: 16,
            background: "#fff",
            boxShadow: "2px 2px 0 #888",
            padding: 8,
            fontFamily: 'inherit',
            fontSize: 18,
            cursor: "pointer"
          }}>
          🎵 Mixtapes
        </button>
      }
    </div>
  );
}

function MacWindow({ children, onClose, onExpand, isOpen, isExpanded }) {
  if (!isOpen) return null;
  return (
    <div style={{
      width: isExpanded ? 540 : 390,
      minHeight: 420,
      border: "3px solid #111",
      borderRadius: 16,
      background: "#faf6f1",
      position: "fixed",
      left: isExpanded ? "50%" : 70,
      top: isExpanded ? "50%" : 70,
      transform: isExpanded ? "translate(-50%, -50%)" : undefined,
      zIndex: 100,
      boxShadow: "6px 8px 0 #baa"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "2px solid #222",
        padding: "8px 10px",
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        background: "#f5ece3",
        userSelect: "none"
      }}>
        <button aria-label="close" style={{
          width: 16, height: 16, background: "#f44", borderRadius: "50%",
          border: "1.5px solid #c22", marginRight: 6, cursor: "pointer"
        }} onClick={onClose}/>
        <button aria-label="expand" style={{
          width: 16, height: 16, background: "#2c5", borderRadius: "50%",
          border: "1.5px solid #194", marginRight: 10, cursor: "pointer"
        }} onClick={onExpand}/>
        <span style={{
          fontFamily: "inherit",
          fontSize: 19,
          fontWeight: "bold",
          letterSpacing: 2
        }}>MIXTAPES</span>
      </div>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}

function TrackSelector({ tracks, current, onSelect }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 28,
      marginBottom: 14
    }}>
      {tracks.map((track, i) =>
        <div key={i} style={{ textAlign: "center", cursor: "pointer" }}
             onClick={() => onSelect(i)}>
          <img src={track.art} alt="" width={48} height={48}
            style={{
              borderRadius: "50%",
              border: i === current ? "2.5px solid #fa8" : "2.5px solid #999",
              boxShadow: i === current ? "0 0 8px #fcc" : "none",
              marginBottom: 4,
              background: "#fff"
            }} />
          <div style={{
            fontSize: 13, background: "#eee",
            borderRadius: 6, padding: "2px 7px",
            fontWeight: 700,
            marginBottom: 2
          }}>
            {track.title}
          </div>
          <div style={{
            fontSize: 12, color: "#666", letterSpacing: 1
          }}>{track.duration}</div>
        </div>
      )}
    </div>
  );
}

function PlayerControls({ isPlaying, onPlay, onPause, onEject, isEjected }) {
  return (
    <div style={{ display: "flex", gap: 15, marginBottom: 8 }}>
      <button onClick={onPlay} disabled={isPlaying || isEjected}
        aria-label="play"
        style={{
          width: 32, height: 32, background: "#fff", border: "2px solid #111",
          borderRadius: 9, fontSize: 20, cursor: "pointer", opacity: isPlaying || isEjected ? 0.4 : 1
        }}>
        ▶
      </button>
      <button onClick={onPause} disabled={!isPlaying || isEjected}
        aria-label="pause"
        style={{
          width: 32, height: 32, background: "#fff", border: "2px solid #111",
          borderRadius: 9, fontSize: 20, cursor: "pointer", opacity: !isPlaying || isEjected ? 0.4 : 1
        }}>
        ⏸
      </button>
      <button onClick={onEject} disabled={isEjected}
        aria-label="eject"
        style={{
          width: 32, height: 32, background: "#fff", border: "2px solid #111",
          borderRadius: 9, fontSize: 20, cursor: "pointer", opacity: isEjected ? 0.4 : 1
        }}>
        ⏏
      </button>
    </div>
  );
}

function NowPlaying({ track, isEjected }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 22, minHeight: 120
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: "50%", overflow: "hidden",
        border: "3.5px solid #888", background: "#fff",
        boxShadow: "0 0 8px #aaa",
        opacity: isEjected ? 0.13 : 1,
        transition: "opacity 0.2s"
      }}>
        <img src={track.art} alt="vinyl" width={100} height={100} style={{ width: "100%", height: "100%" }}/>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{track.title}</div>
        <div style={{ color: "#b58", fontSize: 13 }}>by {track.artist}</div>
        <div style={{ color: "#333", fontSize: 14, marginTop: 5 }}>
          Duration: {track.duration}
        </div>
        <div style={{
          color: "#555", fontSize: 13, marginTop: 8, fontFamily: "monospace"
        }}>
          {isEjected ? "Ejected" : "Ready"}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const audioRef = useRef();

  // Handle play
  const handlePlay = () => {
    if (audioRef.current && !isEjected) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle pause
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle eject
  const handleEject = () => {
    handlePause();
    setIsEjected(true);
  };

  // Handle select new track
  const handleSelect = (idx) => {
    setCurrent(idx);
    setIsEjected(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // When window reopens, reset eject
  const handleOpen = () => {
    setIsOpen(true);
    setIsEjected(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // On close, pause music
  const handleClose = () => {
    setIsOpen(false);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  };

  // Expand toggle
  const handleExpand = () => setIsExpanded(v => !v);

  // When audio ends, stop playing
  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <Dock onOpen={handleOpen} isOpen={isOpen}/>
      <MacWindow
        onClose={handleClose}
        onExpand={handleExpand}
        isOpen={isOpen}
        isExpanded={isExpanded}
      >
        <TrackSelector tracks={tracks} current={current} onSelect={handleSelect} />
        <NowPlaying track={tracks[current]} isEjected={isEjected} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onEject={handleEject}
          isEjected={isEjected}
        />
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={tracks[current].src}
          onEnded={handleEnded}
        />
      </MacWindow>
    </>
  );
}

export default App;
