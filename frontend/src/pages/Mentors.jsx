import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Mentors.css";

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL;

/* =========================================================
   MENTOR DATA
========================================================= */

const baseMentors = [
  {
    name: "Arjun Sharma",
    role: "Software Engineer",
    company: "Google",
    skills: "React Java DSA System Design",
    category: "Development",
    about:
      "Software engineer focused on scalable applications, modern frontend development and technical interview preparation.",
    focus:
      "Software development, React, Java, DSA and system design",
  },
  {
    name: "Priya Nair",
    role: "Backend Engineer",
    company: "Amazon",
    skills: "Node MongoDB AWS APIs",
    category: "Backend",
    about:
      "Backend engineer experienced in APIs, cloud systems and scalable backend architecture.",
    focus:
      "Backend development, Node.js, APIs, MongoDB and AWS",
  },
  {
    name: "Rahul Verma",
    role: "Full Stack Engineer",
    company: "Microsoft",
    skills: "React Azure Node",
    category: "Full Stack",
    about:
      "Full-stack engineer helping students understand modern application development from frontend to cloud.",
    focus:
      "Full-stack development, React, Node.js and Azure",
  },
  {
    name: "Sneha Iyer",
    role: "Data Scientist",
    company: "Netflix",
    skills: "AI ML Python Data",
    category: "AI & Data",
    about:
      "Data scientist passionate about machine learning, Python and practical AI applications.",
    focus:
      "AI, machine learning, Python and data science",
  },
  {
    name: "Kiran Rao",
    role: "Frontend Engineer",
    company: "Meta",
    skills: "React Frontend UI",
    category: "Frontend",
    about:
      "Frontend engineer focused on React, UI engineering and creating high-quality user experiences.",
    focus:
      "React, frontend development, UI and UX",
  },
  {
    name: "Ankit Mehta",
    role: "Software Architect",
    company: "TCS",
    skills: "Java Spring Microservices",
    category: "Backend",
    about:
      "Software architect with experience in enterprise Java systems and microservices.",
    focus:
      "Java, Spring Boot, microservices and architecture",
  },
  {
    name: "Neha Joshi",
    role: "AI Engineer",
    company: "AI Research",
    skills: "AI NLP Python ML",
    category: "AI & Data",
    about:
      "AI engineer specializing in NLP, machine learning and intelligent applications.",
    focus:
      "AI, NLP, Python and machine learning",
  },
  {
    name: "Vikram Singh",
    role: "Cloud Architect",
    company: "Cloud Solutions",
    skills: "Cloud System Design",
    category: "Cloud",
    about:
      "Cloud architect helping students understand distributed systems and cloud technologies.",
    focus:
      "Cloud computing, architecture and system design",
  },
  {
    name: "Pooja Sharma",
    role: "DSA Mentor",
    company: "Competitive Programming",
    skills: "DSA LeetCode CP",
    category: "DSA",
    about:
      "DSA mentor focused on problem solving, coding interviews and competitive programming.",
    focus:
      "DSA, LeetCode, coding interviews and problem solving",
  },
];

const mentors = Array.from({ length: 35 }).map((_, i) => {
  const base = baseMentors[i % baseMentors.length];

  return {
    id: i + 1,
    name: `${base.name} ${i + 1}`,
    role: base.role,
    company: base.company,
    skills: base.skills,
    category: base.category,
    about: base.about,
    focus: base.focus,
    rating: (4.2 + (i % 10) * 0.05).toFixed(1),
    experience: `${4 + (i % 8)}+ Years`,
    students: 50 + ((i * 17) % 450),
    online: i % 4 !== 0,
  };
});

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  "All",
  "Development",
  "Backend",
  "Frontend",
  "Full Stack",
  "AI & Data",
  "Cloud",
  "DSA",
];

/* =========================================================
   HELPERS
========================================================= */

const createMessageId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `message-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
};

const createRoomId = (mentorId) => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `mentor-room-${mentorId}-${crypto.randomUUID()}`;
  }

  return `mentor-room-${mentorId}-${Date.now()}`;
};

const formatTime = (date = new Date()) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

const loadChats = () => {
  try {
    return JSON.parse(localStorage.getItem("mentor_chats")) || {};
  } catch {
    return {};
  }
};

const saveChats = (data) => {
  try {
    localStorage.setItem("mentor_chats", JSON.stringify(data));
  } catch (error) {
    console.error("Unable to save chats:", error);
  }
};

const getInitialMeetingData = () => {
  if (typeof window === "undefined") {
    return {
      mentor: null,
      room: null,
      role: "student",
      invalid: false,
    };
  }

  const params = new URLSearchParams(window.location.search);

  const room = params.get("room");

  if (!room) {
    return {
      mentor: null,
      room: null,
      role: "student",
      invalid: false,
    };
  }

  const role =
    params.get("role") === "mentor"
      ? "mentor"
      : "student";

  const mentorId = Number(params.get("mentor"));

  const mentor = mentors.find(
    (item) => item.id === mentorId
  );

  return {
    mentor,
    room,
    role,
    invalid: !mentor,
  };
};

/* =========================================================
   AI FALLBACK
========================================================= */

function getReply(message) {
  const text = message.toLowerCase();

  if (text.includes("react")) {
    return "For React, focus on components, props, state, hooks, routing and reusable UI. Build small projects while learning.";
  }

  if (text.includes("java")) {
    return "For Java, start with OOP, collections, exception handling, DSA and then move toward Spring Boot.";
  }

  if (text.includes("dsa")) {
    return "For DSA, practice arrays, strings, linked lists, stacks, queues, trees, graphs and dynamic programming consistently.";
  }

  if (
    text.includes("ai") ||
    text.includes("machine learning")
  ) {
    return "For AI and ML, strengthen Python, NumPy, Pandas, statistics, machine learning concepts and practical projects.";
  }

  if (text.includes("career")) {
    return "For career growth, identify your target role, build relevant projects, improve your fundamentals and practice interviews.";
  }

  if (text.includes("placement")) {
    return "For placements, focus on DSA, aptitude, projects, communication and mock interviews. Consistency matters more than studying everything at once.";
  }

  return "That's a good question. Keep working consistently and tell me more about your goal so I can guide you better.";
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Mentors() {
  const initialMeeting = useMemo(
    () => getInitialMeetingData(),
    []
  );

  /* =======================================================
     DISCOVERY
  ======================================================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [activeMentor, setActiveMentor] = useState(
    initialMeeting.mentor || null
  );

  /* =======================================================
     CHAT
  ======================================================= */

  const [chats, setChats] = useState(loadChats);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatConnected, setChatConnected] =
    useState(false);

  const chatSocketRef = useRef(null);
  const chatRoomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* =======================================================
     CALL
  ======================================================= */

  const [isCallActive, setIsCallActive] =
    useState(false);

  const [callStatus, setCallStatus] =
    useState("Waiting for participant...");

  const [callRole, setCallRole] =
    useState(initialMeeting.role || "student");

  const [callType, setCallType] =
    useState("video");

  const [isMuted, setIsMuted] =
    useState(false);

  const [isCameraOff, setIsCameraOff] =
    useState(false);

  const [callDuration, setCallDuration] =
    useState(0);

  const [remoteVideoActive, setRemoteVideoActive] =
    useState(false);

  const [currentRoom, setCurrentRoom] =
    useState("");

  const userVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const currentRoomRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const offerCreatedRef = useRef(false);
  const signalingStartedRef = useRef(false);
  const callTimerRef = useRef(null);

  /* =======================================================
     VOICE RECORDING
  ======================================================= */

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const recordingStreamRef = useRef(null);

  /* =======================================================
     UI MODALS
  ======================================================= */

  const [showProfile, setShowProfile] =
    useState(false);

  const [aiRequest, setAiRequest] =
    useState("");

  const [aiRecommendation, setAiRecommendation] =
    useState(null);

  const [meetingDialog, setMeetingDialog] =
    useState(null);

  const [joinDialog, setJoinDialog] =
    useState(
      initialMeeting.room &&
        initialMeeting.mentor
        ? {
            room: initialMeeting.room,
            role: initialMeeting.role,
            mentor: initialMeeting.mentor,
          }
        : null
    );

  const [meetingCopied, setMeetingCopied] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState(
      initialMeeting.invalid
        ? "This meeting link contains an invalid mentor."
        : ""
    );

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredMentors = useMemo(() => {
    const text = search.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const searchable = [
        mentor.name,
        mentor.company,
        mentor.role,
        mentor.skills,
        mentor.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !text || searchable.includes(text);

      const matchesCategory =
        category === "All" ||
        mentor.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  /* =======================================================
     CHAT HELPERS
  ======================================================= */

  const getChat = (id) => chats[id] || [];

  const updateChat = (id, newChat) => {
    const updated = {
      ...chats,
      [id]: newChat,
    };

    setChats(updated);
    saveChats(updated);
  };

  /* =======================================================
     SELECT MENTOR
  ======================================================= */

  const selectMentor = (mentor) => {
    setActiveMentor(mentor);
    setShowProfile(false);
  };

  /* =======================================================
     SOCKET CHAT
  ======================================================= */

  useEffect(() => {
    if (!activeMentor) {
      return undefined;
    }

    const mentorId = activeMentor.id;
    const mentorName = activeMentor.name;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    chatSocketRef.current = socket;

    const room = `mentor-chat-${mentorId}`;

    chatRoomRef.current = room;

    socket.on("connect", () => {
      setChatConnected(true);

      socket.emit("join-chat", {
        room,
        mentorId,
        role: "student",
      });
    });

    socket.on("chat-message", (incoming) => {
      if (!incoming) return;

      const normalized = {
        id:
          incoming.id ||
          createMessageId(),
        type:
          incoming.senderRole === "mentor"
            ? "mentor"
            : incoming.type || "mentor",
        text: incoming.text || "",
        sender:
          incoming.sender ||
          (incoming.senderRole === "mentor"
            ? mentorName
            : "Student"),
        timestamp:
          incoming.timestamp || formatTime(),
      };

      setChats((previous) => {
        const current =
          previous[mentorId] || [];

        if (
          current.some(
            (item) => item.id === normalized.id
          )
        ) {
          return previous;
        }

        const updated = {
          ...previous,
          [mentorId]: [
            ...current,
            normalized,
          ],
        };

        saveChats(updated);

        return updated;
      });
    });

    socket.on("typing", (data) => {
      if (data?.role === "mentor") {
        setTyping(true);
      }
    });

    socket.on("stop-typing", (data) => {
      if (data?.role === "mentor") {
        setTyping(false);
      }
    });

    socket.on("disconnect", () => {
      setChatConnected(false);
    });

    socket.on("connect_error", () => {
      setChatConnected(false);
    });

    return () => {
      socket.emit("leave-chat", {
        room,
        role: "student",
      });

      socket.removeAllListeners();
      socket.disconnect();

      if (chatSocketRef.current === socket) {
        chatSocketRef.current = null;
      }

      chatRoomRef.current = null;
      setTyping(false);
      setChatConnected(false);
    };
  }, [activeMentor]);

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = () => {
    if (!message.trim() || !activeMentor) {
      return;
    }

    const text = message.trim();

    const userMsg = {
      id: createMessageId(),
      type: "user",
      sender: "You",
      text,
      timestamp: formatTime(),
    };

    updateChat(activeMentor.id, [
      ...getChat(activeMentor.id),
      userMsg,
    ]);

    setMessage("");

    if (
      chatSocketRef.current?.connected &&
      chatRoomRef.current
    ) {
      chatSocketRef.current.emit(
        "chat-message",
        {
          room: chatRoomRef.current,
          id: userMsg.id,
          sender: "Student",
          senderRole: "student",
          text,
          timestamp: userMsg.timestamp,
        }
      );

      return;
    }

    setTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: createMessageId(),
        type: "mentor",
        sender: activeMentor.name,
        text: getReply(text),
        timestamp: formatTime(),
      };

      setChats((previous) => {
        const current =
          previous[activeMentor.id] || [];

        const updated = {
          ...previous,
          [activeMentor.id]: [
            ...current,
            botMsg,
          ],
        };

        saveChats(updated);

        return updated;
      });

      setTyping(false);
    }, 700);
  };

  /* =======================================================
     TYPING
  ======================================================= */

  const handleMessageChange = (value) => {
    setMessage(value);

    if (
      !chatSocketRef.current?.connected ||
      !chatRoomRef.current
    ) {
      return;
    }

    chatSocketRef.current.emit("typing", {
      room: chatRoomRef.current,
      role: "student",
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      chatSocketRef.current?.emit(
        "stop-typing",
        {
          room: chatRoomRef.current,
          role: "student",
        }
      );
    }, 900);
  };

  /* =======================================================
     CLEAR CHAT
  ======================================================= */

  const clearChat = () => {
    if (!activeMentor) return;

    const updated = {
      ...chats,
    };

    delete updated[activeMentor.id];

    setChats(updated);
    saveChats(updated);
  };

  /* =======================================================
     VOICE RECORDING
  ======================================================= */

  const startRecording = async () => {
    if (!activeMentor) return;

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setErrorMessage(
        "Voice recording is not supported by this browser."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      recordingStreamRef.current = stream;

      const recorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const url =
          URL.createObjectURL(blob);

        const voiceMsg = {
          id: createMessageId(),
          type: "user",
          sender: "You",
          audio: url,
          timestamp: formatTime(),
        };

        updateChat(activeMentor.id, [
          ...getChat(activeMentor.id),
          voiceMsg,
        ]);

        stream
          .getTracks()
          .forEach((track) => track.stop());

        recordingStreamRef.current = null;

        clearInterval(
          recordingTimerRef.current
        );

        setRecordingSeconds(0);
      };

      recorder.start();

      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current =
        setInterval(() => {
          setRecordingSeconds(
            (previous) => previous + 1
          );
        }, 1000);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Microphone access was denied. Please allow microphone permission."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    clearInterval(
      recordingTimerRef.current
    );

    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.onstop =
        null;

      mediaRecorderRef.current.stop();
    }

    audioChunksRef.current = [];

    if (recordingStreamRef.current) {
      recordingStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      recordingStreamRef.current = null;
    }

    clearInterval(
      recordingTimerRef.current
    );

    setRecordingSeconds(0);
    setIsRecording(false);
  };

  /* =======================================================
     WEBRTC
  ======================================================= */

  const createPeerConnection = (
    roomId,
    stream
  ) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const peerConnection =
      new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });

    peerConnectionRef.current =
      peerConnection;

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(
          track,
          stream
        );
      });
    }

    peerConnection.ontrack = (event) => {
      if (event.streams?.[0]) {
        const remoteStream =
          event.streams[0];

        peerConnection.remoteStream =
          remoteStream;

        setRemoteVideoActive(true);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject =
            remoteStream;

          remoteVideoRef.current
            .play()
            .catch(() => {});
        }
      }

      setCallStatus("Connected");
    };

    peerConnection.onicecandidate = (
      event
    ) => {
      if (
        event.candidate &&
        socketRef.current &&
        currentRoomRef.current
      ) {
        socketRef.current.emit(
          "ice-candidate",
          {
            room:
              currentRoomRef.current,
            candidate:
              event.candidate,
          }
        );
      }
    };

    peerConnection.onconnectionstatechange =
      () => {
        const state =
          peerConnection.connectionState;

        if (state === "connected") {
          setCallStatus("Connected");
        }

        if (state === "connecting") {
          setCallStatus("Connecting...");
        }

        if (state === "disconnected") {
          setCallStatus(
            "Reconnecting..."
          );
        }

        if (state === "failed") {
          setCallStatus(
            "Connection failed"
          );
        }

        if (state === "closed") {
          setCallStatus("Call ended");
        }
      };

    return peerConnection;
  };

  /* =======================================================
     ATTACH VIDEO
  ======================================================= */

  useEffect(() => {
    if (!isCallActive) return;

    const localStream =
      streamRef.current;

    if (
      localStream &&
      callType === "video" &&
      userVideoRef.current
    ) {
      userVideoRef.current.srcObject =
        localStream;

      userVideoRef.current
        .play()
        .catch(() => {});
    }

    const remoteStream =
      peerConnectionRef.current
        ?.remoteStream;

    if (
      remoteStream &&
      remoteVideoRef.current
    ) {
      remoteVideoRef.current.srcObject =
        remoteStream;

      remoteVideoRef.current
        .play()
        .catch(() => {});
    }
  }, [isCallActive, callType]);

  /* =======================================================
     OFFER
  ======================================================= */

  const createOffer = async () => {
    if (
      offerCreatedRef.current ||
      !peerConnectionRef.current ||
      !socketRef.current ||
      !currentRoomRef.current
    ) {
      return;
    }

    try {
      offerCreatedRef.current = true;

      const offer =
        await peerConnectionRef.current.createOffer();

      await peerConnectionRef.current.setLocalDescription(
        offer
      );

      socketRef.current.emit("offer", {
        room:
          currentRoomRef.current,
        offer,
      });

      setCallStatus(
        "Calling participant..."
      );
    } catch (error) {
      console.error(error);

      offerCreatedRef.current = false;

      setCallStatus(
        "Unable to start the call"
      );
    }
  };

  /* =======================================================
     OFFER HANDLER
  ======================================================= */

  const handleOffer = async (offer) => {
    if (!peerConnectionRef.current) {
      return;
    }

    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      for (const candidate of
        pendingCandidatesRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (error) {
          console.error(error);
        }
      }

      pendingCandidatesRef.current = [];

      const answer =
        await peerConnectionRef.current.createAnswer();

      await peerConnectionRef.current.setLocalDescription(
        answer
      );

      socketRef.current?.emit("answer", {
        room:
          currentRoomRef.current,
        answer,
      });

      setCallStatus("Connecting...");
    } catch (error) {
      console.error(error);

      setCallStatus(
        "Unable to connect"
      );
    }
  };

  /* =======================================================
     ICE
  ======================================================= */

  const handleIceCandidate = async (
    candidate
  ) => {
    try {
      if (!peerConnectionRef.current) {
        return;
      }

      if (
        !peerConnectionRef.current
          .remoteDescription
      ) {
        pendingCandidatesRef.current.push(
          candidate
        );

        return;
      }

      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* =======================================================
     CALL SOCKET
  ======================================================= */

  const setupCallSocket = (
    roomId,
    role
  ) => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", {
        roomId,
        role,
      });
    });

    socket.on("room-joined", (data) => {
      if (data?.waiting) {
        setCallStatus(
          role === "student"
            ? "Waiting for mentor..."
            : "Waiting for student..."
        );
      } else {
        setCallStatus(
          "Participant found. Connecting..."
        );
      }
    });

    socket.on(
      "participant-joined",
      async (data) => {
        if (
          role === "student" &&
          data?.role === "mentor"
        ) {
          await createOffer();
        }

        if (
          role === "mentor" &&
          data?.role === "student"
        ) {
          setCallStatus(
            "Student connected. Waiting for call..."
          );
        }
      }
    );

    socket.on(
      "call-ready",
      async () => {
        if (role === "student") {
          await createOffer();
        }
      }
    );

    socket.on("offer", async (data) => {
      if (role === "mentor") {
        await handleOffer(data.offer);
      }
    });

    socket.on("answer", async (data) => {
      try {
        if (!peerConnectionRef.current) {
          return;
        }

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(
            data.answer
          )
        );

        for (const candidate of
          pendingCandidatesRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error(error);
          }
        }

        pendingCandidatesRef.current = [];

        setCallStatus("Connected");
      } catch (error) {
        console.error(error);

        setCallStatus(
          "Unable to complete connection"
        );
      }
    });

    socket.on(
      "ice-candidate",
      async (data) => {
        await handleIceCandidate(
          data.candidate
        );
      }
    );

    socket.on("call-ended", () => {
      cleanupCall(false);
      setCallStatus("Call ended");
    });

    socket.on("call-error", (data) => {
      setErrorMessage(
        data?.message ||
          "The meeting could not be started."
      );

      cleanupCall(false);
    });

    socket.on("disconnect", () => {
      setCallStatus(
        "Connection lost"
      );
    });
  };

  /* =======================================================
     START CALL
  ======================================================= */

  const startCall = async ({
    mentor = activeMentor,
    type = "video",
    roomId = null,
    role = "student",
  } = {}) => {
    if (!mentor) {
      setErrorMessage(
        "Please select a mentor first."
      );
      return;
    }

    if (signalingStartedRef.current) {
      return;
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setErrorMessage(
        "Camera and microphone access is not supported by this browser."
      );
      return;
    }

    try {
      setCallStatus(
        "Requesting camera and microphone..."
      );

      let stream;

      if (type === "audio") {
        stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: false,
            }
          );
      } else {
        stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: true,
            }
          );
      }

      streamRef.current = stream;

      setActiveMentor(mentor);
      setCallType(type);
      setCallRole(role);
      setIsCallActive(true);
      setIsMuted(false);
      setIsCameraOff(false);
      setCallDuration(0);
      setRemoteVideoActive(false);

      signalingStartedRef.current = true;
      offerCreatedRef.current = false;
      pendingCandidatesRef.current = [];

      const finalRoom =
        roomId ||
        createRoomId(mentor.id);

      currentRoomRef.current =
        finalRoom;

      setCurrentRoom(finalRoom);

      createPeerConnection(
        finalRoom,
        stream
      );

      setupCallSocket(
        finalRoom,
        role
      );

      clearInterval(
        callTimerRef.current
      );

      callTimerRef.current =
        setInterval(() => {
          setCallDuration(
            (previous) =>
              previous + 1
          );
        }, 1000);
    } catch (error) {
      console.error(error);

      signalingStartedRef.current = false;

      setIsCallActive(false);

      if (
        error?.name ===
        "NotAllowedError"
      ) {
        setErrorMessage(
          type === "video"
            ? "Camera or microphone permission was denied. Please allow access and try again."
            : "Microphone permission was denied. Please allow microphone access and try again."
        );
      } else if (
        error?.name ===
        "NotFoundError"
      ) {
        setErrorMessage(
          "A required camera or microphone device could not be found."
        );
      } else {
        setErrorMessage(
          "Unable to access your camera or microphone."
        );
      }
    }
  };

  /* =======================================================
     CLEANUP CALL
  ======================================================= */

  const cleanupCall = (
    notifyServer = true
  ) => {
    if (
      notifyServer &&
      socketRef.current &&
      currentRoomRef.current
    ) {
      socketRef.current.emit(
        "end-call",
        {
          room:
            currentRoomRef.current,
        }
      );
    }

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;
    }

    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }

    clearInterval(
      callTimerRef.current
    );

    callTimerRef.current = null;

    pendingCandidatesRef.current = [];
    currentRoomRef.current = null;

    offerCreatedRef.current = false;
    signalingStartedRef.current = false;

    setCurrentRoom("");
    setRemoteVideoActive(false);
    setIsCallActive(false);
    setIsMuted(false);
    setIsCameraOff(false);
    setCallDuration(0);
  };

  const endCall = () => {
    cleanupCall(true);
    setCallStatus("Call ended");
  };

  /* =======================================================
     MUTE
  ======================================================= */

  const toggleMute = () => {
    const stream =
      streamRef.current;

    if (!stream) return;

    const audioTrack =
      stream.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled =
      !audioTrack.enabled;

    setIsMuted(
      !audioTrack.enabled
    );
  };

  /* =======================================================
     CAMERA
  ======================================================= */

  const toggleCamera = () => {
    if (callType === "audio") {
      return;
    }

    const stream =
      streamRef.current;

    if (!stream) return;

    const videoTrack =
      stream.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled =
      !videoTrack.enabled;

    setIsCameraOff(
      !videoTrack.enabled
    );
  };

  /* =======================================================
     MEETING
  ======================================================= */

  const createMeeting = (mentor) => {
    const roomId =
      createRoomId(mentor.id);

    const params =
      new URLSearchParams({
        room: roomId,
        role: "mentor",
        mentor: String(mentor.id),
      });

    const link =
      `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    setMeetingCopied(false);

    setMeetingDialog({
      mentor,
      roomId,
      link,
    });
  };

  const copyMeetingLink = async (
    link
  ) => {
    try {
      await navigator.clipboard.writeText(
        link
      );

      setMeetingCopied(true);

      setTimeout(() => {
        setMeetingCopied(false);
      }, 2000);
    } catch {
      setErrorMessage(
        "Unable to copy the meeting link."
      );
    }
  };

  const shareMeeting = async (link) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            "EduCore AI Mentor Meeting",
          text:
            "Join my EduCore AI mentorship meeting.",
          url: link,
        });
      } else {
        await copyMeetingLink(link);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyMeetingLink(link);
      }
    }
  };

  const startCreatedMeeting =
    async () => {
      if (!meetingDialog) return;

      const {
        mentor,
        roomId,
      } = meetingDialog;

      setMeetingDialog(null);

      await startCall({
        mentor,
        type: "video",
        roomId,
        role: "student",
      });
    };

  const joinMeeting = async () => {
    if (!joinDialog) return;

    const {
      room,
      mentor,
    } = joinDialog;

    const selectedRole = callRole;

    setJoinDialog(null);

    await startCall({
      mentor,
      type: "video",
      roomId: room,
      role: selectedRole,
    });
  };

  /* =======================================================
     AI MENTOR MATCH
  ======================================================= */

  const findAIMentor = () => {
    if (!aiRequest.trim()) {
      setAiRecommendation(null);
      return;
    }

    const text =
      aiRequest.toLowerCase();

    let bestMentor = mentors[0];

    if (
      text.includes("react") ||
      text.includes("frontend") ||
      text.includes("ui")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "Frontend"
        ) || bestMentor;
    } else if (
      text.includes("java") ||
      text.includes("spring") ||
      text.includes("backend")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "Backend"
        ) || bestMentor;
    } else if (
      text.includes("ai") ||
      text.includes("machine learning") ||
      text.includes("ml") ||
      text.includes("python")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "AI & Data"
        ) || bestMentor;
    } else if (
      text.includes("dsa") ||
      text.includes("leetcode") ||
      text.includes("coding") ||
      text.includes("placement")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "DSA"
        ) || bestMentor;
    } else if (
      text.includes("cloud") ||
      text.includes("aws") ||
      text.includes("azure")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "Cloud"
        ) || bestMentor;
    } else if (
      text.includes("full stack")
    ) {
      bestMentor =
        mentors.find(
          (m) =>
            m.category ===
            "Full Stack"
        ) || bestMentor;
    }

    const matchPercentage =
      Math.min(
        98,
        78 + (text.length % 21)
      );

    setAiRecommendation({
      ...bestMentor,
      matchPercentage,
    });
  };

  const selectRecommendedMentor =
    () => {
      if (!aiRecommendation) return;

      setActiveMentor(
        aiRecommendation
      );

      setAiRecommendation(null);
    };

  /* =======================================================
     PROFILE
  ======================================================= */

  const openProfile = (mentor) => {
    setActiveMentor(mentor);
    setShowProfile(true);
  };

  /* =======================================================
     GLOBAL CLEANUP
  ======================================================= */

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        socketRef.current &&
        currentRoomRef.current
      ) {
        socketRef.current.emit(
          "end-call",
          {
            room:
              currentRoomRef.current,
          }
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (recordingStreamRef.current) {
        recordingStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

      clearInterval(
        callTimerRef.current
      );

      clearInterval(
        recordingTimerRef.current
      );

      clearTimeout(
        typingTimeoutRef.current
      );

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (recordingStreamRef.current) {
        recordingStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }
    };
  }, []);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="mentors-page">
      <div className="mentor-shell">

        {/* =================================================
            TOP NAV
        ================================================= */}

        <header className="mentor-topbar">
          <div className="mentor-brand">
            <div className="brand-mark">
              ✦
            </div>

            <div>
              <strong>Mentor Hub</strong>
              <span>EduCore AI</span>
            </div>
          </div>

          <div className="topbar-status">
            <span className="status-live-dot" />
            Mentorship network active
          </div>
        </header>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="mentor-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span />
              PERSONALIZED MENTORSHIP
            </div>

            <h1>
              Learn from people
              <br />
              who've <em>been there.</em>
            </h1>

            <p>
              Find experienced mentors,
              ask questions, discuss your
              career and connect through
              text, audio or video.
            </p>

            <div className="hero-actions">
              <button
                className="hero-primary"
                onClick={() => {
                  document
                    .getElementById(
                      "mentor-discovery"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                Explore Mentors
                <span>→</span>
              </button>

              <div className="hero-trust">
                <div className="trust-avatars">
                  <span>A</span>
                  <span>P</span>
                  <span>S</span>
                  <span>R</span>
                </div>

                <div>
                  <strong>
                    450+ students
                  </strong>

                  <small>
                    already learning with mentors
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-profile-card">
              <div className="hero-profile-avatar">
                A
                <span />
              </div>

              <div>
                <strong>
                  Arjun Sharma
                </strong>

                <span>
                  Software Engineer · Google
                </span>

                <div className="hero-rating">
                  ★ 4.9
                  <small>
                    • 120 students
                  </small>
                </div>
              </div>
            </div>

            <div className="hero-floating-card floating-top">
              <span className="floating-icon">
                ✦
              </span>

              <div>
                <strong>AI Match</strong>
                <small>94% compatible</small>
              </div>
            </div>

            <div className="hero-floating-card floating-bottom">
              <span className="floating-icon green">
                ●
              </span>

              <div>
                <strong>28 mentors</strong>
                <small>online right now</small>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="mentor-stats-row">
          <div className="network-stat">
            <div className="network-stat-icon purple">
              👥
            </div>

            <div>
              <strong>
                {mentors.length}
              </strong>

              <span>Expert mentors</span>
            </div>
          </div>

          <div className="network-stat">
            <div className="network-stat-icon green">
              ●
            </div>

            <div>
              <strong>
                {
                  mentors.filter(
                    (mentor) =>
                      mentor.online
                  ).length
                }
              </strong>

              <span>Online now</span>
            </div>
          </div>

          <div className="network-stat">
            <div className="network-stat-icon yellow">
              ★
            </div>

            <div>
              <strong>4.7</strong>
              <span>Average rating</span>
            </div>
          </div>

          <div className="network-stat">
            <div className="network-stat-icon blue">
              🎓
            </div>

            <div>
              <strong>2.8K+</strong>
              <span>Students guided</span>
            </div>
          </div>
        </section>

        {/* =================================================
            ALERT
        ================================================= */}

        {errorMessage && (
          <div className="mentor-alert">
            <div>⚠</div>

            <span>{errorMessage}</span>

            <button
              onClick={() =>
                setErrorMessage("")
              }
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            AI MATCH
        ================================================= */}

        <section className="ai-match-section">
          <div className="ai-match-content">
            <div className="ai-spark">
              ✦
            </div>

            <div className="ai-match-copy">
              <div className="section-kicker">
                EDCORE AI
              </div>

              <h2>
                Not sure who to choose?
              </h2>

              <p>
                Tell our AI what you want
                to learn and we'll find the
                right mentor for you.
              </p>
            </div>
          </div>

          <div className="ai-search">
            <span>⌕</span>

            <input
              value={aiRequest}
              onChange={(e) =>
                setAiRequest(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  findAIMentor();
                }
              }}
              placeholder="e.g. I need help with React, DSA and placement preparation..."
            />

            <button
              onClick={findAIMentor}
            >
              Find my mentor
              <span>✦</span>
            </button>
          </div>

          {aiRecommendation && (
            <div className="ai-result">
              <div className="ai-result-avatar">
                {
                  aiRecommendation.name[0]
                }
              </div>

              <div className="ai-result-info">
                <span>
                  ✦ AI RECOMMENDATION
                </span>

                <strong>
                  {aiRecommendation.name}
                </strong>

                <p>
                  {aiRecommendation.role}
                  {" · "}
                  {aiRecommendation.company}
                </p>
              </div>

              <div className="ai-match-score">
                <strong>
                  {
                    aiRecommendation.matchPercentage
                  }
                  %
                </strong>

                <span>Match</span>
              </div>

              <button
                className="ai-connect-btn"
                onClick={
                  selectRecommendedMentor
                }
              >
                Connect →
              </button>

              <button
                className="ai-close"
                onClick={() =>
                  setAiRecommendation(null)
                }
              >
                ×
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            DISCOVERY
        ================================================= */}

        <section
          id="mentor-discovery"
          className="discovery-section"
        >
          <div className="discovery-header">
            <div>
              <div className="section-kicker">
                MENTOR NETWORK
              </div>

              <h2>
                Find your mentor
              </h2>

              <p>
                Explore experts across
                technology, AI, development
                and career growth.
              </p>
            </div>

            <div className="mentor-count">
              <strong>
                {filteredMentors.length}
              </strong>

              <span>mentors</span>
            </div>
          </div>

          <div className="discovery-toolbar">
            <div className="mentor-search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search mentors, companies or skills..."
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ×
                </button>
              )}
            </div>

            <div className="category-list">
              {categories.map(
                (item) => (
                  <button
                    key={item}
                    className={
                      category === item
                        ? "category-selected"
                        : ""
                    }
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN WORKSPACE
        ================================================= */}

        <div className="mentor-workspace">

          {/* =================================================
              MENTOR LIST
          ================================================= */}

          <section className="mentor-list-area">
            <div className="list-heading">
              <div>
                <h3>
                  Recommended mentors
                </h3>

                <span>
                  Choose someone who matches
                  your goals
                </span>
              </div>

              <span className="list-filter-label">
                {category}
              </span>
            </div>

            <div className="mentor-grid">
              {filteredMentors.map(
                (mentor) => (
                  <article
                    key={mentor.id}
                    className={`professional-mentor-card ${
                      activeMentor?.id ===
                      mentor.id
                        ? "mentor-selected"
                        : ""
                    }`}
                  >
                    <div className="mentor-card-header">
                      <div className="professional-avatar">
                        {mentor.name[0]}

                        <span
                          className={
                            mentor.online
                              ? "avatar-online"
                              : "avatar-offline"
                          }
                        />
                      </div>

                      <div className="mentor-rating">
                        <span>★</span>
                        {mentor.rating}
                      </div>
                    </div>

                    <div className="professional-mentor-info">
                      <h3>
                        {mentor.name}
                      </h3>

                      <p>
                        {mentor.role}
                      </p>

                      <span className="company-line">
                        <i />
                        {mentor.company}
                      </span>
                    </div>

                    <div className="mentor-speciality">
                      <span>
                        {mentor.category}
                      </span>

                      <span>
                        {mentor.experience}
                      </span>
                    </div>

                    <div className="mentor-skill-list">
                      {mentor.skills
                        .split(" ")
                        .slice(0, 3)
                        .map(
                          (
                            skill,
                            index
                          ) => (
                            <span
                              key={`${mentor.id}-${skill}-${index}`}
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>

                    <div className="mentor-card-footer">
                      <button
                        className="view-profile-btn"
                        onClick={() =>
                          openProfile(
                            mentor
                          )
                        }
                      >
                        View profile
                      </button>

                      <button
                        className="quick-connect-btn"
                        onClick={() =>
                          selectMentor(
                            mentor
                          )
                        }
                      >
                        Connect
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>

            {filteredMentors.length ===
              0 && (
              <div className="no-mentors">
                <div>⌕</div>

                <h3>
                  No mentors found
                </h3>

                <p>
                  Try another search
                  or category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>

          {/* =================================================
              COMMUNICATION PANEL
          ================================================= */}

          <aside
            className={`communication-panel ${
              activeMentor
                ? "communication-active"
                : ""
            }`}
          >
            {!activeMentor ? (
              <div className="communication-empty">
                <div className="empty-communication-icon">
                  💬
                </div>

                <h3>
                  Your mentor space
                </h3>

                <p>
                  Select a mentor to start
                  communicating through
                  text, audio or video.
                </p>

                <div className="communication-options">
                  <span>💬 Chat</span>
                  <span>🎤 Voice</span>
                  <span>📞 Audio</span>
                  <span>📹 Video</span>
                </div>
              </div>
            ) : (
              <>
                {/* PANEL HEADER */}

                <div className="communication-header">
                  <div
                    className="communication-mentor"
                    onClick={() =>
                      openProfile(
                        activeMentor
                      )
                    }
                  >
                    <div className="communication-avatar">
                      {
                        activeMentor.name[0]
                      }

                      <span
                        className={
                          activeMentor.online
                            ? "avatar-online"
                            : "avatar-offline"
                        }
                      />
                    </div>

                    <div>
                      <strong>
                        {activeMentor.name}
                      </strong>

                      <span>
                        {chatConnected ? (
                          <>
                            <i className="real-time-dot" />
                            Available for chat
                          </>
                        ) : activeMentor.online ? (
                          <>
                            <i className="real-time-dot" />
                            Online now
                          </>
                        ) : (
                          "Currently offline"
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    className="panel-more-btn"
                    onClick={() =>
                      openProfile(
                        activeMentor
                      )
                    }
                  >
                    ⋯
                  </button>
                </div>

                {/* COMMUNICATION ACTIONS */}

                <div className="communication-actions">
                  <button
                    onClick={() =>
                      startCall({
                        mentor:
                          activeMentor,
                        type: "audio",
                        role: "student",
                      })
                    }
                  >
                    <span>📞</span>
                    <small>Audio</small>
                  </button>

                  <button
                    className="communication-video"
                    onClick={() =>
                      startCall({
                        mentor:
                          activeMentor,
                        type: "video",
                        role: "student",
                      })
                    }
                  >
                    <span>📹</span>
                    <small>Video</small>
                  </button>

                  <button
                    onClick={() =>
                      createMeeting(
                        activeMentor
                      )
                    }
                  >
                    <span>＋</span>
                    <small>Meeting</small>
                  </button>
                </div>

                {/* CHAT TITLE */}

                <div className="chat-section-title">
                  <div>
                    <span>CONVERSATION</span>

                    <strong>
                      Direct message
                    </strong>
                  </div>

                  <button
                    onClick={clearChat}
                    title="Clear conversation"
                  >
                    🗑
                  </button>
                </div>

                {/* CHAT */}

                <div className="professional-chat">
                  {getChat(
                    activeMentor.id
                  ).length === 0 ? (
                    <div className="chat-start">
                      <div className="chat-start-avatar">
                        {
                          activeMentor.name[0]
                        }
                      </div>

                      <strong>
                        Start a conversation
                      </strong>

                      <p>
                        Ask about{" "}
                        {activeMentor.category.toLowerCase()},
                        career growth or your
                        current project.
                      </p>

                      <div className="suggested-messages">
                        <button
                          onClick={() => {
                            setMessage(
                              "Can you guide me about my career path?"
                            );
                          }}
                        >
                          Career guidance
                        </button>

                        <button
                          onClick={() => {
                            setMessage(
                              "Can you help me prepare for placements?"
                            );
                          }}
                        >
                          Placement help
                        </button>

                        <button
                          onClick={() => {
                            setMessage(
                              "Can you review my project idea?"
                            );
                          }}
                        >
                          Project advice
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="messages-list">
                      {getChat(
                        activeMentor.id
                      ).map(
                        (
                          chatItem,
                          index
                        ) => {
                          const isUser =
                            chatItem.type ===
                            "user";

                          const key =
                            chatItem.id ||
                            `message-${index}`;

                          return (
                            <div
                              key={key}
                              className={`chat-message ${
                                isUser
                                  ? "message-user"
                                  : "message-mentor"
                              }`}
                            >
                              {!isUser && (
                                <div className="small-message-avatar">
                                  {
                                    activeMentor.name[0]
                                  }
                                </div>
                              )}

                              <div className="message-content">
                                {!isUser && (
                                  <small>
                                    {
                                      chatItem.sender
                                    }
                                  </small>
                                )}

                                <div className="message-bubble">
                                  {chatItem.audio ? (
                                    <audio
                                      controls
                                      src={
                                        chatItem.audio
                                      }
                                    />
                                  ) : (
                                    chatItem.text
                                  )}
                                </div>

                                <time>
                                  {
                                    chatItem.timestamp
                                  }
                                </time>
                              </div>
                            </div>
                          );
                        }
                      )}

                      {typing && (
                        <div className="chat-message message-mentor">
                          <div className="small-message-avatar">
                            {
                              activeMentor.name[0]
                            }
                          </div>

                          <div className="typing-indicator">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RECORDING */}

                {isRecording && (
                  <div className="recording-interface">
                    <div className="recording-wave">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div>
                      <strong>
                        Recording voice
                      </strong>

                      <small>
                        {formatDuration(
                          recordingSeconds
                        )}
                      </small>
                    </div>

                    <button
                      onClick={
                        cancelRecording
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className="send-recording"
                      onClick={
                        stopRecording
                      }
                    >
                      Send
                    </button>
                  </div>
                )}

                {/* CHAT INPUT */}

                <div className="professional-chat-input">
                  <button
                    className="input-icon-btn"
                    onClick={
                      startRecording
                    }
                    disabled={isRecording}
                    title="Voice message"
                  >
                    🎤
                  </button>

                  <input
                    value={message}
                    onChange={(e) =>
                      handleMessageChange(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        sendMessage();
                      }
                    }}
                    placeholder="Write a message..."
                  />

                  <button
                    className="send-message-btn"
                    onClick={
                      sendMessage
                    }
                    disabled={
                      !message.trim()
                    }
                  >
                    ↑
                  </button>
                </div>

                <div className="communication-note">
                  <span>🔒</span>
                  Your mentorship conversation is private
                </div>
              </>
            )}
          </aside>
        </div>

        {/* =================================================
            PROFILE MODAL
        ================================================= */}

        {showProfile &&
          activeMentor && (
            <div
              className="professional-modal-backdrop"
              onMouseDown={(e) => {
                if (
                  e.target ===
                  e.currentTarget
                ) {
                  setShowProfile(false);
                }
              }}
            >
              <div className="professional-profile-modal">
                <button
                  className="modal-close"
                  onClick={() =>
                    setShowProfile(false)
                  }
                >
                  ×
                </button>

                <div className="profile-modal-top">
                  <div className="profile-large-avatar">
                    {
                      activeMentor.name[0]
                    }

                    <span
                      className={
                        activeMentor.online
                          ? "avatar-online"
                          : "avatar-offline"
                      }
                    />
                  </div>

                  <div className="profile-main-info">
                    <div className="profile-status">
                      <span />
                      {activeMentor.online
                        ? "Available now"
                        : "Currently offline"}
                    </div>

                    <h2>
                      {activeMentor.name}
                    </h2>

                    <p>
                      {activeMentor.role}
                      {" · "}
                      {activeMentor.company}
                    </p>

                    <div className="profile-rating-row">
                      <span>
                        ★{" "}
                        {activeMentor.rating}
                      </span>

                      <span>
                        {activeMentor.experience}
                      </span>

                      <span>
                        {activeMentor.students}+
                        students
                      </span>
                    </div>
                  </div>
                </div>

                <div className="profile-divider" />

                <div className="profile-body">
                  <div className="profile-column">
                    <section>
                      <span className="profile-kicker">
                        ABOUT
                      </span>

                      <h3>
                        About this mentor
                      </h3>

                      <p>
                        {
                          activeMentor.about
                        }
                      </p>
                    </section>

                    <section>
                      <span className="profile-kicker">
                        MENTORSHIP
                      </span>

                      <h3>
                        What they can help with
                      </h3>

                      <p>
                        {
                          activeMentor.focus
                        }
                      </p>
                    </section>
                  </div>

                  <div className="profile-column">
                    <section>
                      <span className="profile-kicker">
                        EXPERTISE
                      </span>

                      <h3>
                        Skills
                      </h3>

                      <div className="profile-skill-cloud">
                        {activeMentor.skills
                          .split(" ")
                          .map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={`${skill}-${index}`}
                              >
                                {skill}
                              </span>
                            )
                          )}
                      </div>
                    </section>

                    <div className="profile-connect-box">
                      <strong>
                        Ready to connect?
                      </strong>

                      <p>
                        Choose how you want to
                        communicate.
                      </p>

                      <div>
                        <button
                          onClick={() => {
                            setShowProfile(
                              false
                            );

                            setActiveMentor(
                              activeMentor
                            );
                          }}
                        >
                          💬 Chat
                        </button>

                        <button
                          onClick={() => {
                            setShowProfile(
                              false
                            );

                            startCall({
                              mentor:
                                activeMentor,
                              type: "audio",
                              role: "student",
                            });
                          }}
                        >
                          📞 Audio
                        </button>

                        <button
                          className="profile-video-btn"
                          onClick={() => {
                            setShowProfile(
                              false
                            );

                            startCall({
                              mentor:
                                activeMentor,
                              type: "video",
                              role: "student",
                            });
                          }}
                        >
                          📹 Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            MEETING MODAL
        ================================================= */}

        {meetingDialog && (
          <div className="professional-modal-backdrop">
            <div className="meeting-modal">
              <div className="meeting-icon">
                📹
              </div>

              <span className="profile-kicker">
                EDCORE AI
              </span>

              <h2>
                Your meeting is ready
              </h2>

              <p>
                Invite{" "}
                <strong>
                  {
                    meetingDialog
                      .mentor.name
                  }
                </strong>{" "}
                to join this mentorship
                session.
              </p>

              <div className="meeting-code">
                <span>MEETING ID</span>

                <strong>
                  {
                    meetingDialog.roomId
                  }
                </strong>
              </div>

              <div className="meeting-link">
                <input
                  value={
                    meetingDialog.link
                  }
                  readOnly
                />

                <button
                  onClick={() =>
                    copyMeetingLink(
                      meetingDialog.link
                    )
                  }
                >
                  {meetingCopied
                    ? "Copied ✓"
                    : "Copy"}
                </button>
              </div>

              <div className="meeting-buttons">
                <button
                  className="secondary-modal-btn"
                  onClick={() =>
                    shareMeeting(
                      meetingDialog.link
                    )
                  }
                >
                  ↗ Share
                </button>

                <button
                  className="primary-modal-btn"
                  onClick={
                    startCreatedMeeting
                  }
                >
                  Start meeting →
                </button>
              </div>

              <button
                className="modal-text-btn"
                onClick={() =>
                  setMeetingDialog(null)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            JOIN MEETING
        ================================================= */}

        {joinDialog && (
          <div className="professional-modal-backdrop">
            <div className="meeting-modal">
              <div className="meeting-icon">
                👋
              </div>

              <span className="profile-kicker">
                EDCORE AI
              </span>

              <h2>
                Join mentor meeting
              </h2>

              <div className="join-mentor-card">
                <div>
                  {
                    joinDialog
                      .mentor.name[0]
                  }
                </div>

                <section>
                  <strong>
                    {
                      joinDialog
                        .mentor.name
                    }
                  </strong>

                  <span>
                    {
                      joinDialog
                        .mentor.role
                    }
                    {" · "}
                    {
                      joinDialog
                        .mentor.company
                    }
                  </span>
                </section>
              </div>

              <div className="meeting-code">
                <span>MEETING ID</span>

                <strong>
                  {joinDialog.room}
                </strong>
              </div>

              <div className="role-choice">
                <span>
                  Join as
                </span>

                <div>
                  <button
                    className={
                      callRole ===
                      "student"
                        ? "role-choice-active"
                        : ""
                    }
                    onClick={() =>
                      setCallRole(
                        "student"
                      )
                    }
                  >
                    🎓 Student
                  </button>

                  <button
                    className={
                      callRole ===
                      "mentor"
                        ? "role-choice-active"
                        : ""
                    }
                    onClick={() =>
                      setCallRole(
                        "mentor"
                      )
                    }
                  >
                    👨‍🏫 Mentor
                  </button>
                </div>
              </div>

              <div className="permission-message">
                <span>🔐</span>
                Camera and microphone access
                will only be requested after
                joining.
              </div>

              <div className="meeting-buttons">
                <button
                  className="secondary-modal-btn"
                  onClick={() =>
                    setJoinDialog(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="primary-modal-btn"
                  onClick={
                    joinMeeting
                  }
                >
                  Join meeting →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            FULL SCREEN CALL
        ================================================= */}

        {isCallActive && (
          <div className="call-screen">

            <div className="call-topbar">
              <div className="call-brand">
                <div>✦</div>

                <section>
                  <strong>
                    EduCore AI
                  </strong>

                  <span>
                    Mentor session
                  </span>
                </section>
              </div>

              <div className="call-session-info">
                <span
                  className={
                    callStatus ===
                    "Connected"
                      ? "call-connected"
                      : ""
                  }
                >
                  <i />
                  {callStatus}
                </span>

                <strong>
                  {formatDuration(
                    callDuration
                  )}
                </strong>
              </div>
            </div>

            <div className="call-stage">
              {callType ===
              "audio" ? (
                <div className="audio-call-stage">
                  <div className="audio-call-avatar">
                    {
                      activeMentor?.name?.[0] ||
                      "M"
                    }
                  </div>

                  <h2>
                    {
                      activeMentor?.name
                    }
                  </h2>

                  <p>
                    {callStatus}
                  </p>

                  <div className="audio-pulse">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : (
                <div className="video-call-stage">
                  <video
                    ref={
                      remoteVideoRef
                    }
                    autoPlay
                    playsInline
                    className="remote-call-video"
                  />

                  {!remoteVideoActive && (
                    <div className="remote-call-placeholder">
                      <div>
                        {
                          activeMentor?.name?.[0] ||
                          "M"
                        }
                      </div>

                      <h3>
                        {
                          activeMentor?.name
                        }
                      </h3>

                      <p>
                        {
                          callStatus
                        }
                      </p>
                    </div>
                  )}

                  <div className="remote-call-label">
                    {callRole ===
                    "student"
                      ? activeMentor?.name
                      : "Student"}
                  </div>

                  <div className="local-call-video">
                    {isCameraOff ? (
                      <div className="camera-disabled">
                        <span>
                          You
                        </span>
                      </div>
                    ) : (
                      <video
                        ref={
                          userVideoRef
                        }
                        autoPlay
                        playsInline
                        muted
                      />
                    )}

                    <span>
                      You
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="call-bottom">
              <div className="call-meeting-id">
                <span>
                  Meeting ID
                </span>

                <strong>
                  {currentRoom ||
                    "Creating..."}
                </strong>
              </div>

              <div className="call-controls">
                <button
                  className={
                    isMuted
                      ? "call-control-active"
                      : ""
                  }
                  onClick={
                    toggleMute
                  }
                >
                  <span>
                    {isMuted
                      ? "🔇"
                      : "🎤"}
                  </span>

                  {isMuted
                    ? "Unmute"
                    : "Mute"}
                </button>

                {callType ===
                  "video" && (
                  <button
                    className={
                      isCameraOff
                        ? "call-control-active"
                        : ""
                    }
                    onClick={
                      toggleCamera
                    }
                  >
                    <span>
                      📹
                    </span>

                    {isCameraOff
                      ? "Camera on"
                      : "Camera off"}
                  </button>
                )}

                <button
                  className="end-call-btn"
                  onClick={
                    endCall
                  }
                >
                  <span>☎</span>
                  End call
                </button>
              </div>

              <div className="call-role">
                {callRole ===
                "student"
                  ? "🎓 Student"
                  : "👨‍🏫 Mentor"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}