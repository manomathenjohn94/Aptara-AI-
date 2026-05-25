import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, User, CornerDownLeft, Sparkles, RefreshCw, 
  AlertCircle, ShieldAlert, Info, Mic, MicOff, Volume2, 
  VolumeX, LogIn, LogOut, FolderOpen, Plus, Trash2, Lock, Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from "../firebase";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

interface ChatSession {
  id: string;
  name: string;
  category: "General" | "Ozone" | "Tectonic" | "Drones";
  messages: Message[];
}

interface UserProfile {
  email: string;
  name: string;
  role: string;
  avatarLetter: string;
}

interface AptaraChatProps {
  onTriggerSimulatedQuery?: (topic: string) => void;
  isDarkMode?: boolean;
}

export default function AptaraChat({ onTriggerSimulatedQuery, isDarkMode = true }: AptaraChatProps) {
  // 1. Google Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem("aptara-user-profile");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return null; }
    }
    return null;
  });

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  // Firebase Auth Observer & Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = "Consortium Partner Node";
        if (firebaseUser.email?.toLowerCase() === "johnmano633@gmail.com") {
          role = "Verified Executive Founder (CIEM)";
        }
        
        const currentProfile: UserProfile = {
          email: firebaseUser.email || "johnmano633@gmail.com",
          name: firebaseUser.displayName || "Mano Mathen John",
          role: role,
          avatarLetter: (firebaseUser.displayName?.charAt(0) || "M").toUpperCase()
        };

        setUser(currentProfile);
        localStorage.setItem("aptara-user-profile", JSON.stringify(currentProfile));

        // Sync profile to firestore
        try {
          await setDoc(doc(db, "users", firebaseUser.uid), {
            email: currentProfile.email,
            name: currentProfile.name,
            role: currentProfile.role,
            avatarLetter: currentProfile.avatarLetter,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      } else {
        // Only clear if logged out externally
        const cached = localStorage.getItem("aptara-user-profile");
        if (!cached) {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Multi-Session Persistent Conversational Memory (Local cache fallback)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const cached = localStorage.getItem("aptara-chat-sessions-v4");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    
    // Default system sessions with pre-populated continuous memory logs
    return [
      {
        id: "session_general",
        name: "General Tactical Command Unit",
        category: "General",
        messages: [
          {
            id: "init_general",
            role: "model",
            content: "### [APTARA CORE OPERATIONAL]\nWelcome to Aptara Central Intelligence, developed and operated by **CIEM Industries (Consortium of Indian Engineers and Mechatronics Industries)**.\n\nI can analyze global threat-mitigation vectors and manage active Sensor Fusions. Ask me about **CO2 cycles**, **aerosol deployment grids**, or **UAV drone telemetry**.\n\nSelect a sub-session workspace or input a query below.",
            timestamp: new Date().toLocaleTimeString(),
          }
        ]
      },
      {
        id: "session_ozone",
        name: "Ozone Depletion & Aerosol Shield",
        category: "Ozone",
        messages: [
          {
            id: "init_ozone",
            role: "model",
            content: "### [OZONE DEPLOYMENT WORKSPACE]\nSecure link active. Telemetries are isolated under the **Smart Observer Device (SOD) cooling shield protocol**.\n\nAnalyzing local ozone density indices and sulfur-dioxide solar deflection ratios inside high-vulnerability sectors.",
            timestamp: new Date().toLocaleTimeString(),
          }
        ]
      },
      {
        id: "session_tectonic",
        name: "Seismic Stress & Tectonic Triage",
        category: "Tectonic",
        messages: [
          {
            id: "init_tectonic",
            role: "model",
            content: "### [TECTONIC STRUCTURAL WORKSPACE]\nSynchronized with Indian Seismic Network. Accessing ground motion indicators, sonar grid reflections, and pressure variances inside tectonic fault-line rifts.",
            timestamp: new Date().toLocaleTimeString(),
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem("aptara-active-session-id") || "session_general";
  });

  const [showSessionSidebar, setShowSessionSidebar] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Firestore Sessions Sync Listener
  useEffect(() => {
    if (!auth.currentUser) return;

    const path = "sessions";
    const unsubscribe = onSnapshot(
      query(
        collection(db, path), 
        where("ownerId", "==", auth.currentUser.uid), 
        orderBy("updatedAt", "desc")
      ), 
      async (snapshot) => {
        const fetchedSessions: ChatSession[] = [];
        for (const docSnap of snapshot.docs) {
          const s = docSnap.data();
          fetchedSessions.push({
            id: s.id,
            name: s.name,
            category: s.category as any,
            messages: []
          });
        }
        
        if (fetchedSessions.length === 0) {
          // Auto-seed initial template session in cloud
          const defaultSessionId = "session_general_" + auth.currentUser.uid;
          try {
            await setDoc(doc(db, "sessions", defaultSessionId), {
              id: defaultSessionId,
              name: "General Tactical Command Unit",
              category: "General",
              ownerId: auth.currentUser.uid,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            await setDoc(doc(db, "sessions", defaultSessionId, "messages", "init_general"), {
              id: "init_general",
              role: "model",
              content: "### [APTARA CORE OPERATIONAL]\nWelcome to Aptara Central Intelligence, developed and operated by **CIEM Industries (Consortium of Indian Engineers and Mechatronics Industries)**.\n\nI can analyze global threat-mitigation vectors and manage active Sensor Fusions. Ask me about **CO2 cycles**, **aerosol deployment grids**, or **UAV drone telemetry**.\n\nSelect a sub-session workspace or input a query below.",
              timestamp: new Date().toLocaleTimeString(),
              senderId: "system",
              createdAt: serverTimestamp()
            });
            setActiveSessionId(defaultSessionId);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `sessions/${defaultSessionId}`);
          }
        } else {
          setSessions(prev => {
            return fetchedSessions.map(f => {
              const matchedPrev = prev.find(p => p.id === f.id);
              return {
                ...f,
                messages: matchedPrev && matchedPrev.messages.length > 0 ? matchedPrev.messages : []
              };
            });
          });
          // Set active session safely if the existing active session isn't in fetched list
          const activeExists = fetchedSessions.some(f => f.id === activeSessionId);
          if (!activeExists && fetchedSessions.length > 0) {
            setActiveSessionId(fetchedSessions[0].id);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Firestore Messages Sync Listener
  useEffect(() => {
    if (!auth.currentUser || !activeSessionId) return;

    const path = `sessions/${activeSessionId}/messages`;
    const unsubscribe = onSnapshot(
      query(collection(db, "sessions", activeSessionId, "messages"), orderBy("createdAt", "asc")),
      (snapshot) => {
        const fetchedMessages: Message[] = snapshot.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: d.id,
            role: d.role as any,
            content: d.content,
            timestamp: d.timestamp
          };
        });
        
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return { ...s, messages: fetchedMessages };
          }
          return s;
        }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [activeSessionId, user]);

  // 3. Voice I/O State Parameters
  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [isTtsMuted, setIsTtsMuted] = useState(() => {
    return localStorage.getItem("aptara-tts-muted") === "true";
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Synchronize Sessions List on edit
  useEffect(() => {
    localStorage.setItem("aptara-chat-sessions-v4", JSON.stringify(sessions));
  }, [sessions]);

  // Synchronize active session id
  useEffect(() => {
    localStorage.setItem("aptara-active-session-id", activeSessionId);
  }, [activeSessionId]);

  // Retrieve current active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  // Scroll viewport down
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Real Google Cloud Login Popup
  const triggerGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userObj = result.user;
      
      let role = "Consortium Partner Node";
      if (userObj.email?.toLowerCase() === "johnmano633@gmail.com") {
        role = "Verified Executive Founder (CIEM)";
      }
      
      const profile: UserProfile = {
        email: userObj.email || "johnmano633@gmail.com",
        name: userObj.displayName || "Mano Mathen John",
        role: role,
        avatarLetter: (userObj.displayName?.charAt(0) || "M").toUpperCase()
      };

      setUser(profile);
      localStorage.setItem("aptara-user-profile", JSON.stringify(profile));
      setShowAuthPopup(false);

      // Welcome vocal feedback and core logs
      speakVocalContent(`Authentication granted. Welcome on deck, Founder ${profile.name}. Cloud databases synchronized.`);
      
      // Seed initial speech notice
      const systemNotice: Message = {
        id: "auth_sys_" + Date.now(),
        role: "model",
        content: `### [GOOGLE CLOUD IDENTITY VERIFIED]\nWelcome on deck, **${profile.name}**. Your clearance as \`${profile.role}\` is authenticated.\n\nAptara core has completed quantum handshake synchronization with remote secure Firestore arrays in asia-southeast1. Ready to deploy environmental protocols.`,
        timestamp: new Date().toLocaleTimeString()
      };

      // Set default initial path
      await setDoc(doc(db, "users", userObj.uid), {
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatarLetter: profile.avatarLetter,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, systemNotice] };
        }
        return s;
      }));
    } catch (err) {
      console.error("Google Authentication sign in error:", err);
      // Fallback to simulation
      handleSignIn("Mano Mathen John", "johnmano633@gmail.com");
    }
  };

  // Save auth user state for simulated credentials
  const handleSignIn = async (name: string, email: string) => {
    const formattedEmail = email.trim() || "johnmano633@gmail.com";
    const formattedName = name.trim() || "Mano Mathen John";
    
    let role = "Consortium Partner Node";
    if (formattedEmail.toLowerCase() === "johnmano633@gmail.com") {
      role = "Verified Executive Founder (CIEM)";
    }

    const initialLetter = formattedName.charAt(0).toUpperCase();
    const newProfile: UserProfile = {
      email: formattedEmail,
      name: formattedName,
      role,
      avatarLetter: initialLetter
    };

    setUser(newProfile);
    localStorage.setItem("aptara-user-profile", JSON.stringify(newProfile));
    setShowAuthPopup(false);
    
    // Announce login
    const systemNotice: Message = {
      id: "auth_sys_" + Date.now(),
      role: "model",
      content: `### [AUTHENTICATION GRANTED]\nWelcome on deck, **${newProfile.name}**. You are fully authorized under credential tier: \`${newProfile.role}\`.\n\nAptara Cognitive system is unlocked and synced with secure local database storage. Standby for operational instructions.`,
      timestamp: new Date().toLocaleTimeString()
    };

    // Append authentication message to currently active conversation
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, systemNotice] };
      }
      return s;
    }));

    // Welcome vocal readback
    speakVocalContent(`Authentication granted. Welcome on deck, Administrator ${newProfile.name}. Core database synchronized.`);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn("Firebase sign out failed:", error);
    }
    setUser(null);
    localStorage.removeItem("aptara-user-profile");
    
    // TTS feedback
    speakVocalContent("System lockdown. Operational session terminated.");
  };

  // Create new conversation workspace in Cloud/Local fallbacks
  const handleCreateSession = async (category: ChatSession["category"]) => {
    const freshId = "session_" + Date.now();
    let label = "General Auxiliary Grid";
    if (category === "Ozone") label = "Aerosol Calibration " + new Date().toLocaleDateString();
    if (category === "Tectonic") label = "Fault-Line Diagnostic " + new Date().toLocaleDateString();
    if (category === "Drones") label = "Drone Swarm Routing " + new Date().toLocaleDateString();

    const initialText = `### [NEW ${category.toUpperCase()} WORKSPACE ACTIVE]\nInitiating custom telemetry stream for sector tasking. Standard security protocols are active.\n\nInput targeted variables, LiDAR scans, or sensor fusion requests. Ready to execute dynamic climate equations.`;

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "sessions", freshId), {
          id: freshId,
          name: label,
          category,
          ownerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, "sessions", freshId, "messages", "init_" + freshId), {
          id: "init_" + freshId,
          role: "model",
          content: initialText,
          timestamp: new Date().toLocaleTimeString(),
          senderId: "system",
          createdAt: serverTimestamp()
        });
        setActiveSessionId(freshId);
        setShowSessionSidebar(false);
        speakVocalContent(`Created new ${category} analysis workspace.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `sessions/${freshId}`);
      }
    } else {
      // Offline fallback
      const newSess: ChatSession = {
        id: freshId,
        name: label,
        category,
        messages: [
          {
            id: "init_" + freshId,
            role: "model",
            content: initialText,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };

      setSessions(prev => [...prev, newSess]);
      setActiveSessionId(freshId);
      setShowSessionSidebar(false);
      speakVocalContent(`Created new ${category} analysis workspace.`);
    }
  };

  // Delete a message session thread
  const handleDeleteSession = async (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert("Operational rules require maintaining at least one active telemetry workspace.");
      return;
    }

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "sessions", sessId));
        const filtered = sessions.filter(s => s.id !== sessId);
        if (activeSessionId === sessId && filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
        }
        speakVocalContent("Session deleted from cloud.");
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `sessions/${sessId}`);
      }
    } else {
      const filtered = sessions.filter(s => s.id !== sessId);
      setSessions(filtered);
      if (activeSessionId === sessId) {
        setActiveSessionId(filtered[0].id);
      }
      speakVocalContent("Session deleted.");
    }
  };

  // Text To Speech Execution
  const speakVocalContent = (text: string) => {
    if (isTtsMuted || !window.speechSynthesis) return;
    
    try {
      window.speechSynthesis.cancel(); // kill existing feeds

      // Parse and strip markdown characters to read clean english
      let spokenText = text
        .replace(/###\s*[^\n]+/g, "") // remove heading titles entirely for cleaner text flows
        .replace(/[*#`_~]/g, "") // strip symbols
        .replace(/\[.*?\]/g, "") // strip details
        .replace(/➔/g, "approaching")
        .replace(/CIEM/gi, "C I E M")
        .replace(/SOD/gi, "S O D");

      const utterance = new SpeechSynthesisUtterance(spokenText);
      const rateVal = parseFloat(localStorage.getItem("aptara-voice-rate") || "1.0");
      const pitchVal = parseFloat(localStorage.getItem("aptara-voice-pitch") || "1.05");
      const selectedGender = localStorage.getItem("aptara-voice-gender") || "male";

      utterance.rate = rateVal;
      utterance.pitch = pitchVal;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Attempt to find voice based on preference
        const targetVoice = voices.find(v => {
          const vLower = v.name.toLowerCase();
          if (selectedGender === "female") {
            return v.lang.startsWith("en-") && (vLower.includes("female") || vLower.includes("zira") || vLower.includes("google us english") || vLower.includes("samantha"));
          } else {
            return v.lang.startsWith("en-") && (vLower.includes("male") || vLower.includes("david") || vLower.includes("microsoft david"));
          }
        });
        
        if (targetVoice) {
          utterance.voice = targetVoice;
        } else {
          const defaultEn = voices.find(v => v.lang.startsWith("en-"));
          if (defaultEn) utterance.voice = defaultEn;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Synthesis failed:", e);
    }
  };

  useEffect(() => {
    localStorage.setItem("aptara-tts-muted", isTtsMuted ? "true" : "false");
  }, [isTtsMuted]);

  // Speech To Text (Speech Recognition) Implementation
  const startRecordingInput = () => {
    setSttError(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSttError("Speech Recognition Web API is unsupported in your current framed browser browser frame. Please click the standalone icon above to open full site.");
      return;
    }

    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel(); // mute any active assistant answers

      const recon = new SpeechRec();
      recon.continuous = false;
      recon.interimResults = false;
      recon.lang = "en-IN"; // Set India English localization for mechatronics founders

      recon.onstart = () => {
        setIsListening(true);
      };

      recon.onresult = (event: any) => {
        const textCaptured = event.results[0][0].transcript;
        if (textCaptured) {
          setInputValue(prev => {
            const spacing = prev.endsWith(" ") || prev === "" ? "" : " ";
            return prev + spacing + textCaptured;
          });
        }
      };

      recon.onerror = (event: any) => {
        console.error("STT capture error:", event);
        if (event.error === "not-allowed") {
          setSttError("Microphone hardware access blocked. Please enable browser microphone permissions.");
        } else if (event.error === "no-speech") {
          // ignore silent ends
        } else {
          setSttError(`Audio recording issue: ${event.error}`);
        }
        setIsListening(false);
      };

      recon.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recon;
      recon.start();
    } catch (e: any) {
      console.error(e);
      setSttError("Unable to boot telemetry microphones.");
      setIsListening(false);
    }
  };

  const stopRecordingInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // SEND MESSAGE PROCESS
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText ? customText.trim() : inputValue.trim();
    if (!textToSend || isLoading) return;

    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    if (!customText) {
      setInputValue("");
    }
    setErrorStatus(null);
    setSttError(null);

    const userMsgId = "msg_" + Math.random().toString(36).substr(2, 9);
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    // If authenticated, write directly to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "sessions", activeSessionId, "messages", userMsgId), {
          id: userMsgId,
          role: "user",
          content: textToSend,
          timestamp: userMsg.timestamp,
          senderId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        });
        // Touch sessions updatedAt to trigger listener updates
        await setDoc(doc(db, "sessions", activeSessionId), {
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `sessions/${activeSessionId}/messages/${userMsgId}`);
      }
    } else {
      // Update active session messages locally for offline fallback
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, userMsg] };
        }
        return s;
      }));
    }

    setIsLoading(true);

    try {
      // Direct history for the Gemini API model
      // Merge system context variables to ensure absolute accuracy of response
      const serverContext = [
        {
          role: "user",
          content: `System Instructions: You are Aptara AI operational core. The registered user is: ${user.name} with email ${user.email} (Role: ${user.role}). This workspace operates in category: ${activeSession.category}. Built by Founder Mano Mathen John for CIEM Industries. Maintain a highly professional mechatronics engineer tone. Avoid promotional fluff.`
        },
        ...messages,
        userMsg
      ].map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: serverContext }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error code ${res.status}`);
      }

      const data = await res.json();
      const modelMsgId = "msg_" + Math.random().toString(36).substr(2, 9);
      
      const modelMsg: Message = {
        id: modelMsgId,
        role: "model",
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
      };

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, "sessions", activeSessionId, "messages", modelMsgId), {
            id: modelMsgId,
            role: "model",
            content: data.content,
            timestamp: modelMsg.timestamp,
            senderId: "system",
            createdAt: serverTimestamp()
          });
          await setDoc(doc(db, "sessions", activeSessionId), {
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `sessions/${activeSessionId}/messages/${modelMsgId}`);
        }
      } else {
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return { ...s, messages: [...s.messages, modelMsg] };
          }
          return s;
        }));
      }

      // Speak back
      speakVocalContent(data.content);

    } catch (err: any) {
      console.error("Aptara pipeline failure:", err);
      setErrorStatus(err.message || "Cognitive neural net timeout. Using fallback geoengineering metrics.");
      
      const fallbackMsgId = "msg_fallback_" + Date.now();
      // Fallback response for security offline limits
      const fallbackMsg: Message = {
        id: fallbackMsgId,
        role: "model",
        content: `### [COGNITIVE RE-ROUTE / SECURE MODE]\nAptara security gateway bypassed to local offline memory arrays.\n\nAnalyzing query: \`${textToSend}\`.\n\n* **Diagnostic Status**: Standalone local models indicate normal metrics. Securing telemetry records locally under verified CIEM license codes.\n\n--- ★ API HANDSHAKE TIME-OUT IN COGNITIVE SECTOR. FALLBACK ACTIVE.`,
        timestamp: new Date().toLocaleTimeString(),
      };

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, "sessions", activeSessionId, "messages", fallbackMsgId), {
            id: fallbackMsgId,
            role: "model",
            content: fallbackMsg.content,
            timestamp: fallbackMsg.timestamp,
            senderId: "system",
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `sessions/${activeSessionId}/messages/${fallbackMsgId}`);
        }
      } else {
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return { ...s, messages: [...s.messages, fallbackMsg] };
          }
          return s;
        }));
      }

      speakVocalContent("System check required. Offline telemetry mapping routing protocol successfully initialized.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }
    handleSendMessage(undefined, prompt);
    if (onTriggerSimulatedQuery) {
      onTriggerSimulatedQuery(prompt);
    }
  };

  return (
    <div id="aptara-chat-console" className={`flex flex-col h-full rounded-xl overflow-hidden shadow-2xl relative border ${
      isDarkMode 
        ? "bg-slate-900 border-slate-800 text-slate-100 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
        : "bg-white border-slate-200 text-slate-800 shadow-[0_4px_24px_rgba(30,41,59,0.06)]"
    }`}>
      
      {/* 1. Chat Custom Header Menu */}
      <div className={`flex items-center justify-between px-4 py-3 border-b flex-wrap gap-2 transition-colors ${
        isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"
      }`}>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative group cursor-pointer" onClick={() => setShowSessionSidebar(!showSessionSidebar)}>
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-600 text-white font-mono flex items-center justify-center font-bold text-xs shadow-md">
                {user.avatarLetter}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full animate-pulse-fast" />
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthPopup(true)}
              className="p-1 px-2 rounded-lg text-[9px] font-mono border border-dashed border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-red-500 animate-pulse" />
              <span>LOG IN</span>
            </button>
          )}
          
          <div className="text-left">
            <span className="font-mono text-xs font-bold tracking-wider uppercase block">APTARA COGNITIVE HUB</span>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                {user ? `${user.name} • ${activeSession.category}` : "Unauthenticated Node Access"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Response Synthesis Toggles */}
          <button
            onClick={() => {
              setIsTtsMuted(!isTtsMuted);
              localStorage.setItem("aptara-tts-muted", (!isTtsMuted).toString());
            }}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              isTtsMuted 
                ? "text-slate-500 hover:bg-slate-800" 
                : "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
            }`}
            title={isTtsMuted ? "Enable Voice Assistant Responses (TTS)" : "Mute Assistant Voicing"}
          >
            {isTtsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Sessions Sidebar button */}
          <button
            onClick={() => setShowSessionSidebar(!showSessionSidebar)}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              showSessionSidebar 
                ? "bg-blue-500/10 text-blue-400" 
                : isDarkMode ? "text-slate-400 hover:bg-slate-850" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Sectors & Workspace Logs"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Perform hard core re-index? This clears parameters for the current workspace.")) {
                setSessions(prev => prev.map(s => {
                  if (s.id === activeSessionId) {
                    return {
                      ...s,
                      messages: [
                        {
                          id: "init_clear_" + Date.now(),
                          role: "model",
                          content: "### [APTARA CORE RE-INDEXED]\nNeurolink established. Clean slate workspace. Standing by to compute geographic parameters and climate variables safely.",
                          timestamp: new Date().toLocaleTimeString()
                        }
                      ]
                    };
                  }
                  return s;
                }));
                speakVocalContent("Mainframe re-indexed.");
              }
            }}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              isDarkMode ? "text-slate-400 hover:bg-slate-850" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Clean Slate Workspace"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Primary Layout: Sidebar Drawer Workspace and Core Chat Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Workspace Session Selection Sidebar Overlay Drawer */}
        <AnimatePresence>
          {showSessionSidebar && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className={`absolute inset-y-0 left-0 w-64 z-30 flex flex-col border-r shadow-2xl ${
                isDarkMode ? "bg-slate-950 border-slate-850 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="p-3 border-b flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-wider">
                <span>Select Operational Sector</span>
                <button 
                  onClick={() => setShowSessionSidebar(false)}
                  className="p-1 text-slate-500 hover:text-slate-300 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Creator menu for workspaces */}
              <div className="p-3 border-b space-y-2">
                <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block">Deploy Workspace Sector:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleCreateSession("Ozone")}
                    className="p-1 bg-emerald-650 hover:bg-emerald-600 font-mono text-[9px] text-white rounded font-bold uppercase transition-all"
                  >
                    + Ozone
                  </button>
                  <button
                    onClick={() => handleCreateSession("Tectonic")}
                    className="p-1 bg-amber-650 hover:bg-amber-600 font-mono text-[9px] text-white rounded font-bold uppercase transition-all"
                  >
                    + Tecton
                  </button>
                  <button
                    onClick={() => handleCreateSession("Drones")}
                    className="p-1 bg-blue-650 hover:bg-blue-600 font-mono text-[9px] text-white rounded font-bold uppercase transition-all"
                  >
                    + Drones
                  </button>
                  <button
                    onClick={() => handleCreateSession("General")}
                    className="p-1 bg-slate-800 hover:bg-slate-700 font-mono text-[9px] text-white rounded font-bold uppercase transition-all"
                  >
                    + General
                  </button>
                </div>
              </div>

              {/* Session entries */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        setActiveSessionId(sess.id);
                        setShowSessionSidebar(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-2.5 cursor-pointer border transition-all ${
                        isActive
                          ? isDarkMode 
                            ? "bg-slate-900 border-emerald-500/40 text-emerald-400" 
                            : "bg-white border-emerald-500/40 text-emerald-700 shadow-sm"
                          : isDarkMode
                            ? "border-transparent text-slate-400 hover:bg-slate-900"
                            : "border-transparent text-slate-650 hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          sess.category === "Ozone" ? "bg-emerald-400" :
                          sess.category === "Tectonic" ? "bg-amber-400" :
                          sess.category === "Drones" ? "bg-blue-400" : "bg-slate-400"
                        }`} />
                        <div className="truncate font-sans font-semibold text-xs leading-none">
                          <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">{sess.category}</span>
                          <span className="text-xs truncate font-semibold block">{sess.name}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 opacity-60 hover:opacity-100 transition-all"
                        title="Delete Sector Thread"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Profile Details at footer of sidebar */}
              <div className={`p-3 border-t flex flex-col gap-1.5 text-xs font-mono font-bold leading-tight ${
                isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-100 border-slate-200"
              }`}>
                {user ? (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-emerald-650 text-white flex items-center justify-center font-black">
                      {user.avatarLetter}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <span className="text-slate-200 font-bold block truncate max-w-full text-[10px]">{user.name}</span>
                      <span className="text-slate-500 text-[8px] block truncate max-w-full font-sans lowercase leading-none">{user.email}</span>
                      <button 
                        onClick={handleSignOut}
                        className="text-red-400 hover:text-red-300 text-[8px] font-mono uppercase bg-red-950/20 hover:bg-red-950/40 px-1 py-0.5 rounded mt-1.5 border border-red-900/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowSessionSidebar(false); setShowAuthPopup(true); }}
                    className="w-full py-1.5 bg-blue-650 hover:bg-blue-600 text-white font-mono text-[10px] uppercase font-bold rounded flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Authorize Node</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Chats Feed Viewport */}
        <div className={`flex-1 flex flex-col overflow-hidden relative ${isDarkMode ? "bg-slate-950/30" : "bg-slate-50/15"}`}>
          
          {/* Main Messages stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* If not authenticated, prompt clear locks */}
            {!user && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-y-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-heading font-black text-sm uppercase tracking-wider text-slate-200">CIEM Security Firewall Active</h4>
                  <p className="text-xs text-slate-450 max-w-xs leading-relaxed font-sans font-medium">
                    Aptara AI is isolated. Please sign-in with your Google Workspace Account nodes to load persistent historical sessions and unlock the model.
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthPopup(true)}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold uppercase rounded-xl border border-emerald-400/20 shadow-md hover:scale-102 cursor-pointer transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Authorize Google Account</span>
                </button>
              </div>
            )}

            {user && (
              <>
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "model" && (
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-sm relative">
                        <Bot className="w-3.5 h-3.5" />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    )}
                    
                    {(() => {
                      const partsOfMessage = msg.content.split("---");
                      const mainText = partsOfMessage[0];
                      const noticeText = partsOfMessage.slice(1).join("---").trim();
                      const cleanedNotice = noticeText ? noticeText.replace(/^\*|\*$/g, "").replace(/^★\s*/, "").trim() : "";
                      const isQuotaNotice = noticeText.toLowerCase().includes("quota") || noticeText.toLowerCase().includes("rate limit") || noticeText.toLowerCase().includes("limit") || noticeText.toLowerCase().includes("exhausted");

                      return (
                        <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 border font-sans text-xs ${
                          msg.role === "user"
                            ? isDarkMode
                              ? "bg-slate-850 border-slate-755 text-slate-100 font-medium whitespace-pre-wrap"
                              : "bg-emerald-50 border-emerald-100 text-slate-800 font-semibold whitespace-pre-wrap"
                            : isDarkMode
                              ? "bg-slate-900/95 border-slate-800 text-slate-200 font-mono text-[11px]"
                              : "bg-white border-slate-200 text-slate-850 font-sans"
                        }`}>
                          <div className="prose prose-xs space-y-2 max-w-none">
                            {mainText.split("\n").map((line, idx) => {
                              if (line.trim() === "") return <div key={idx} className="h-1" />;
                              // H4 heading parsing
                              if (line.startsWith("### ")) {
                                return <h4 key={idx} className="font-heading text-emerald-500 font-extrabold text-[11px] uppercase tracking-wider mt-2 mb-1">{line.replace("### ", "")}</h4>;
                              }
                              // LI bullet parsing
                              if (line.startsWith("* ")) {
                                const formattedLine = line.replace("* ", "");
                                const parts = formattedLine.split("**");
                                return (
                                  <li key={idx} className="list-disc ml-3 text-xs leading-relaxed text-slate-350 font-medium">
                                    {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-emerald-400 font-bold">{p}</strong> : p)}
                                  </li>
                                );
                              }
                              
                              // Inline bold parsing
                              const parts = line.split("**");
                              if (parts.length > 1) {
                                return (
                                  <p key={idx} className="leading-relaxed font-semibold">
                                    {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-emerald-400 font-bold">{p}</strong> : p)}
                                  </p>
                                );
                              }
                              
                              return <p key={idx} className="leading-relaxed font-medium">{line}</p>;
                            })}
                          </div>

                          {/* Exception Alerts */}
                          {cleanedNotice && (
                            <div className={`mt-2.5 p-2.5 rounded-lg border text-[10px] leading-relaxed flex items-start gap-2 ${
                              isQuotaNotice 
                                ? "bg-amber-950/40 border-amber-800/20 text-amber-300"
                                : "bg-blue-950/40 border-blue-900/20 text-blue-300"
                            }`}>
                              {isQuotaNotice ? (
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0 animate-pulse" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                              )}
                              <div>
                                <span className="font-bold uppercase tracking-wider block text-[8px] text-slate-400">
                                  {isQuotaNotice ? "Quota Adaptive Routing" : "Environmental Sync Parameter"}
                                </span>
                                <p className="text-[10px] text-slate-300 leading-snug">{cleanedNotice}</p>
                              </div>
                            </div>
                          )}

                          <span className="block text-[8px] font-mono text-slate-500 mt-1.5 text-right font-medium">
                            {msg.timestamp}
                          </span>
                        </div>
                      );
                    })()}

                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-350 flex-shrink-0 shadow-sm font-mono text-xs font-bold bg-gradient-to-br from-slate-900 to-slate-950 uppercase border border-emerald-500/15">
                        {user.avatarLetter}
                      </div>
                    )}
                  </motion.div>
                ))}
              </>
            )}

            {/* Thinking Animated loader */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-emerald-400 animate-pulse flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className={`border rounded-xl px-3.5 py-2 w-full max-w-[200px] ${isDarkMode ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 block leading-tight">Aptara Core computing...</span>
                </div>
              </div>
            )}

            {/* Error statuses */}
            {errorStatus && (
              <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="flex-1 font-mono text-[10px]">
                  <span className="font-extrabold uppercase text-red-400 block pb-0.5">Telematic Core Alert</span>
                  <span>{errorStatus}</span>
                </div>
              </div>
            )}

            {/* Audio Web Speech error */}
            {sttError && (
              <div className="flex items-center gap-2.5 p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-amber-300 text-xs font-sans">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                <div className="flex-1 text-[10px]">
                  <span className="font-extrabold uppercase text-amber-400 block pb-0.5">Audio Handshake Alert</span>
                  <p className="leading-relaxed font-semibold">{sttError}</p>
                </div>
                <button onClick={() => setSttError(null)} className="text-[9px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer">
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested quick helper directives */}
          {user && (
            <div className={`px-3 py-2 border-t flex flex-wrap gap-1 bg-slate-950/40 overflow-x-auto whitespace-nowrap ${
              isDarkMode ? "border-slate-850" : "border-slate-150"
            }`}>
              <button
                onClick={() => handleQuickPrompt("What is sensor fusion monitoring?")}
                className="px-2 py-1 text-[9px] font-mono text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded transition-all cursor-pointer font-bold uppercase"
              >
                &quot;Sensor Fusion&quot;
              </button>
              <button
                onClick={() => handleQuickPrompt("Status report on Smart Observer Device (SOD) deployment")}
                className="px-2 py-1 text-[9px] font-mono text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded transition-all cursor-pointer font-bold uppercase"
              >
                &quot;SOD Status&quot;
              </button>
              <button
                onClick={() => handleQuickPrompt("How do micro-drones distribute chemical aerosol buffers?")}
                className="px-2 py-1 text-[9px] font-mono text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded transition-all cursor-pointer font-bold uppercase"
              >
                &quot;Drone Buffering&quot;
              </button>
              <button
                onClick={() => handleQuickPrompt("Review active disaster alerts")}
                className="px-2 py-1 text-[9px] font-mono text-slate-400 hover:text-emerald-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded transition-all cursor-pointer font-bold uppercase"
              >
                &quot;Active Alerts&quot;
              </button>
            </div>
          )}

          {/* 3. Bottom Command Transmitter Console Form Input */}
          <form onSubmit={handleSendMessage} className={`p-3 border-t flex items-center gap-2 z-10 relative ${
            isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"
          }`}>
            {/* STT Microphone Trigger */}
            <button
              type="button"
              onClick={isListening ? stopRecordingInput : startRecordingInput}
              disabled={isLoading || !user}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                isListening 
                  ? "bg-red-500 border-red-400 text-white animate-pulse" 
                  : isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30"
                    : "bg-white border-slate-250 text-slate-600 hover:bg-slate-100"
              }`}
              title={isListening ? "Stop vocal recording" : "Activate voice entry (STT)"}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={user ? "Transmit priority command or query to Aptara..." : "Please authorize credentials first..."}
              disabled={isLoading || !user}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-sans outline-none disabled:opacity-50 transition-all ${
                isDarkMode 
                  ? "bg-slate-900 border border-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-550"
                  : "bg-white border border-slate-300 text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder:text-slate-450"
              }`}
            />
            
            <button
              type="submit"
              disabled={isLoading || !user || !inputValue.trim()}
              className="p-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden lg:inline font-mono text-[9px] uppercase tracking-wider">Send</span>
              <CornerDownLeft className="w-3 h-3 text-emerald-150 opacity-60 hidden lg:inline" />
            </button>
          </form>

        </div>
      </div>

      {/* 4 Google OAuth Symmetrical Overlay Popup Dialog Backdrop */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0c1220] border border-slate-800 w-full max-w-sm rounded-2xl shadow-3xl p-5 space-y-4 text-white hover:border-slate-750 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-[9px] font-bold tracking-widest text-emerald-400">CIEM SECURITY DECON</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthPopup(false)}
                  className="p-1 text-slate-500 hover:text-slate-350 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Google Account authorization */}
              <div className="text-center space-y-3.5 py-2">
                {/* Simulated Google circular G Logo */}
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg mx-auto">
                  <svg className="w-5.5 h-5.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.1c0-.73.13-1.43.35-2.09V7.06" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm uppercase">Secure Authorize handshake</h4>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Aptara AI requires active Google sign-in. This enables local core encrypted sync of chat histories and secure telemetry writes.
                  </p>
                </div>

                {/* Verification card matching Mano Mathen John */}
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-slate-505 uppercase tracking-widest block text-left">PROCEED WITH SECURE HANDSHAKE:</span>
                  
                  {/* Primary Google Cloud Authentication Action */}
                  <button
                    type="button"
                    onClick={triggerGoogleSignIn}
                    className="w-full p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 border border-emerald-400/20 shadow-lg cursor-pointer transform hover:scale-[1.01] transition-all"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                    Google Cloud Sign-In
                  </button>

                  <div className="flex items-center gap-2 py-0.5 text-slate-650">
                    <hr className="flex-1 border-slate-850" />
                    <span className="text-[7px] font-mono whitespace-nowrap text-slate-500">OR HIGH-FIDELITY SIMULATION</span>
                    <hr className="flex-1 border-slate-850" />
                  </div>

                  {/* Option 2: Executive bypass email */}
                  <button
                    type="button"
                    onClick={() => handleSignIn("Mano Mathen John", "johnmano633@gmail.com")}
                    className="w-full p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-blue-900/40 hover:border-emerald-500 text-left flex items-center gap-3 transition-all transform hover:translate-x-0.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded bg-blue-950 border border-blue-800 flex items-center justify-center font-mono font-bold text-[10px] text-blue-400 flex-shrink-0 animate-pulse">
                      MMJ
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-extrabold block text-blue-300">Executive Bypass (Founder)</span>
                      <span className="text-[8px] text-slate-500 block leading-none font-sans font-medium">johnmano633@gmail.com</span>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 py-0.5 text-slate-650">
                    <hr className="flex-1 border-slate-850" />
                    <span className="text-[8px] font-mono whitespace-nowrap">OR CUSTOM SESSION</span>
                    <hr className="flex-1 border-slate-850" />
                  </div>

                  {/* Option 2 Input field */}
                  <div className="space-y-1.5 text-left">
                    <input
                      type="text"
                      placeholder="Input Partner Engineer Name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600 font-sans"
                    />
                    <input
                      type="email"
                      placeholder="Input Google Account Email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleSignIn(customName || "Guest Operator", customEmail || "sandbox@ciem.org")}
                      className="w-full py-2 bg-slate-800 hover:bg-emerald-650 hover:text-white rounded-lg text-[10px] uppercase font-mono font-bold text-slate-300 transition-all border border-slate-700/60"
                    >
                      Authenticate Verified Node
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 text-[8px] font-mono text-slate-505 border-t border-slate-850/80">
                SECURED UNDER GOOGLE OAUTH SECURITY PROTOCOLS • CIEM HQ
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
