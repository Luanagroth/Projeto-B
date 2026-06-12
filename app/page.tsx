"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CORRECT_DATE = "16/11/2025";
const START_DATE = new Date("2025-11-16T00:00:00");

type Step =
  | "intro"
  | "password"
  | "unlocking"
  | "counter"
  | "access"
  | "report"
  | "achievements"
  | "special"
  | "video"
  | "ending"
  | "final";

const errorMessages = [
  "NÃO ACREDITO! 😱",
  "Bruno... sério? 😂",
  "Vou fingir que não vi. Tenta de novo ❤️",
  "Última tentativa antes de dormir no sofá 😌",
];

const reportItems = [
  ["🍳", "Habilidade culinária", "98%"],
  ["🍰", "Experimentos com doces", "287"],
  ["🛡️", "Instinto protetor", "100%"],
  ["💡", "Criatividade", "9999+"],
  ["😂", "Risadas compartilhadas", "18.492.763"],
  ["🎬", "Filmes terminados acordado", "100%"],
  ["😴", "Filmes terminados pela Luana acordada", "3%"],
  ["🎁", "Pedidos negados", "0 registros"],
];

const achievements = [
  {
    icon: "🛠️",
    title: "Manual de Instruções Não Necessário",
    description:
      "Monta, desmonta, arruma, conserta, planta, pinta, corta e ainda diz que foi fácil.",
  },
  {
    icon: "🏗️",
    title: "Departamento de Obras Particular",
    description:
      "Encanador, pintor, jardineiro, eletricista e faz-tudo oficial da família.",
  },
  {
    icon: "🍽️",
    title: "Perigo na Cozinha",
    description:
      "Entra para fazer qualquer coisinha e sai entregando comida de restaurante.",
  },
  {
    icon: "✨",
    title: "Fiscal da Própria Aparência",
    description:
      "Sempre conferindo se está bonito. Infelizmente para minha paz, quase sempre está.",
  },
  {
    icon: "🔥",
    title: "Patrimônio Particular da Luana",
    description:
      "Categoria: gostoso. Registro exclusivo, vitalício e intransferível.",
  },
  {
    icon: "🎭",
    title: "Drama Premium Edition",
    description:
      "Um pouquinho dramático, mas com charme suficiente para ser perdoado.",
  },
  {
    icon: "🤍",
    title: "Fornecedor Oficial de Carinho",
    description:
      "Abraços, cuidado e atenção com estoque renovado diariamente.",
  },
  {
    icon: "🤝",
    title: "Modo Melhor Amigo Ativado",
    description:
      "A primeira pessoa que eu quero procurar quando algo bom ou ruim acontece.",
  },
  {
    icon: "🌟",
    title: "Referência da Maria e do Juninho",
    description:
      "Um exemplo de cuidado, presença e amor para duas crianças que te admiram muito.",
  },
];

function getTimeTogether() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor(diff / (1000 * 60)),
    seconds: Math.floor(diff / 1000),
  };
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [step, setStep] = useState<Step>("intro");
  const [attempts, setAttempts] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const [musicStarted, setMusicStarted] = useState(false);
  const [timeTogether, setTimeTogether] = useState(getTimeTogether());

  const [nickname, setNickname] = useState("");
  const [accessError, setAccessError] = useState("");

  const [reportAnswer, setReportAnswer] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAccepted, setPaymentAccepted] = useState(false);
  const [showNegotiationDenied, setShowNegotiationDenied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTogether(getTimeTogether());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function startMusic() {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0.25;
      audioRef.current.src = "/audio/mirrors.mp3";
      audioRef.current.loop = true;
      await audioRef.current.play();
      setMusicStarted(true);
    } catch (error) {
      console.error("Erro ao tocar música:", error);
    }
  }

  async function switchToAnaJulia() {
    if (!audioRef.current) {
      setStep("video");
      return;
    }

    try {
      audioRef.current.pause();
      audioRef.current.src = "/audio/ana-julia.mp3";
      audioRef.current.volume = 0.35;
      audioRef.current.loop = true;
      await audioRef.current.play();
      setMusicStarted(true);
      setStep("video");
    } catch (error) {
      console.error("Erro ao trocar música:", error);
      setStep("video");
    }
  }

  function moveButton() {
    if (attempts >= 5) return;

    setAttempts((prev) => prev + 1);
    setButtonPosition({
      x: Math.random() * 900 - 450,
      y: Math.random() * 500 - 250,
    });
  }

  function handleIntroClick() {
    if (attempts >= 5) setStep("password");
  }

  function formatDate(value: string) {
    let onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers.length > 2) {
      onlyNumbers = onlyNumbers.slice(0, 2) + "/" + onlyNumbers.slice(2);
    }

    if (onlyNumbers.length > 5) {
      onlyNumbers = onlyNumbers.slice(0, 5) + "/" + onlyNumbers.slice(5);
    }

    return onlyNumbers.slice(0, 10);
  }

  function handleDateSubmit() {
    if (date.trim() === CORRECT_DATE) {
      setStep("unlocking");

      setTimeout(() => {
        setStep("counter");
      }, 2500);

      return;
    }

    setError(errorMessages[Math.min(attempts, errorMessages.length - 1)]);
  }

  function handleAccessSubmit() {
    const answer = nickname.trim().toLowerCase();

    if (answer === "amor" || answer === "vida") {
      setStep("report");
      return;
    }

    setAccessError("Hmm... essa não é a resposta que eu esperava 😂");
  }

  const introMessage =
    attempts === 0
      ? "Mas antes… precisa provar que quer mesmo continuar 😏"
      : attempts === 1
        ? "Foi quase 😂"
        : attempts === 2
          ? "Última chance... 👀"
          : "Ok, você venceu. Agora precisa acertar a senha ❤️";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09070f] px-6 py-10 text-white">
      <audio ref={audioRef} src="/audio/mirrors.mp3" loop />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c2d5c55,transparent_35%),radial-gradient(circle_at_bottom,#1d4ed855,transparent_35%)]" />

      <div className="absolute left-6 top-6 z-20">
        {!musicStarted ? (
          <button
            onClick={startMusic}
            className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white/80 backdrop-blur hover:bg-white/20"
          >
            🎵 Ativar trilha sonora
          </button>
        ) : (
          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-pink-200 backdrop-blur">
            🎵 Trilha sonora tocando
          </div>
        )}
      </div>

      <section className="relative z-10 w-full max-w-4xl text-center">
        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl space-y-8"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Projeto B
            </p>

            <h1 className="text-4xl font-bold md:text-6xl">
              Bruno, você foi convidado para desbloquear uma história.
            </h1>

            <p className="text-white/70">{introMessage}</p>

            <motion.button
              animate={buttonPosition}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              onMouseEnter={moveButton}
              onClick={handleIntroClick}
              className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
            >
              {attempts < 3
                ? "Quero continuar ❤️"
                : "Precisa acertar a senha 🔐"}
            </motion.button>

            <p className="text-xs text-white/40">Tentativas: {attempts}/3</p>
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"
          >
            <h2 className="mb-4 text-3xl font-bold">
              Verificação de identidade ❤️
            </h2>

            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-pink-300">
              Data do primeiro encontro
            </p>

            <p className="mb-6 text-white/70">
              Qual data nós nos conhecemos?
            </p>

            <input
              value={date}
              onChange={(e) => {
                setDate(formatDate(e.target.value));
                setError("");
              }}
              maxLength={10}
              placeholder="DD/MM/AAAA"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-2xl tracking-[0.3em] outline-none focus:border-pink-400"
            />

            {error && (
              <div className="mt-5 rounded-2xl bg-pink-500/20 p-4 text-pink-100">
                <strong>{error}</strong>
                <p className="text-sm text-white/70">
                  Tenta de novo, vai. Eu acredito em você… mais ou menos 😂
                </p>
              </div>
            )}

            <button
              onClick={handleDateSubmit}
              className="mt-6 rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
            >
              Confirmar ❤️
            </button>
          </motion.div>
        )}

        {step === "unlocking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-8xl"
            >
              ❤️
            </motion.div>

            <h2 className="text-4xl font-bold">Identidade confirmada</h2>
            <p className="text-white/70">Desbloqueando nossa história...</p>
          </motion.div>
        )}

        {step === "counter" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl space-y-8"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Nosso tempo
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Há exatamente este tempo construindo nossa história ❤️
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                [timeTogether.days, "dias"],
                [timeTogether.hours, "horas"],
                [timeTogether.minutes, "minutos"],
                [timeTogether.seconds, "segundos"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <strong className="text-4xl text-pink-300">{value}</strong>
                  <p className="text-white/60">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-white/70">
              E eu escolheria viver cada segundo novamente.
            </p>

            <button
              onClick={() => setStep("access")}
              className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
            >
              Próxima etapa 🔐
            </button>
          </motion.div>
        )}

        {step === "access" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-pink-300">
              Chave de acesso
            </p>

            <h2 className="mb-4 text-3xl font-bold">
              Para liberar o relatório oficial...
            </h2>

            <p className="mb-6 text-white/70">
              Qual apelido carinhoso eu uso com você?
            </p>

            <input
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setAccessError("");
              }}
              placeholder="Digite aqui..."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-2xl outline-none focus:border-pink-400"
            />

            {accessError && (
              <div className="mt-5 rounded-2xl bg-pink-500/20 p-4 text-pink-100">
                <strong>{accessError}</strong>
                <p className="text-sm text-white/70">
                  Dica: é uma coisa bem óbvia, amor. 👀
                </p>
              </div>
            )}

            <button
              onClick={handleAccessSubmit}
              className="mt-6 rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
            >
              Liberar relatório ❤️
            </button>
          </motion.div>
        )}

        {step === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Relatório oficial
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Análise completa do Bruno ❤️
            </h2>

            <p className="text-white/70">
              Dados coletados ao longo de anos de convivência e observação
              científica extremamente rigorosa.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reportItems.map(([icon, label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur"
                >
                  <div className="mb-3 text-3xl">{icon}</div>
                  <p className="text-white/60">{label}</p>
                  <strong className="text-3xl text-pink-300">{value}</strong>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-3 text-2xl font-bold">
                Você concorda com esses dados? 🤔
              </h3>

              <p className="mb-4 text-white/70">
                Sua opinião é extremamente importante para esta pesquisa.
              </p>

              <textarea
                value={reportAnswer}
                onChange={(e) => setReportAnswer(e.target.value)}
                placeholder="Digite sua opinião..."
                className="min-h-120px w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-pink-400"
              />

              <button
                onClick={() => setShowPayment(true)}
                className="mt-4 rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
              >
                Enviar opinião ❤️
              </button>
            </div>

            {showPayment && !paymentAccepted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-pink-400/30 bg-pink-500/10 p-8"
              >
                <h3 className="mb-4 text-3xl font-bold">⚠️ Atenção</h3>
                <p className="mb-6 text-white/70">Este serviço é cobrado.</p>

                <div className="space-y-3 text-xl">
                  <p>💋 20 beijinhos</p>
                  <p>🤗 5 abraços</p>
                  <p>👃 2 cheirinhos no cangote</p>
                </div>

                <p className="mt-6 text-sm text-white/50">
                  * Oferta válida somente para Bruno.
                  <br />
                  * Não cumulativa com promoções anteriores.
                  <br />* Pagamento obrigatório em até 24 horas.
                </p>

                <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-center">
                  <button
                    onClick={() => {
                      setPaymentAccepted(true);
                      setShowNegotiationDenied(false);
                    }}
                    className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899]"
                  >
                    ACEITAR OFERTA ❤️
                  </button>

                  <button
                    onClick={() => setShowNegotiationDenied(true)}
                    className="rounded-full border border-white/20 px-8 py-4 font-bold hover:bg-white/10"
                  >
                    NEGOCIAR VALORES 😏
                  </button>
                </div>
              </motion.div>
            )}

            {showNegotiationDenied && !paymentAccepted && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-3xl border border-pink-400/30 bg-white/10 p-8 shadow-2xl backdrop-blur"
              >
                <h3 className="mb-4 text-3xl font-bold text-pink-300">
                  ❌ Negociação recusada
                </h3>

                <p className="text-white/70">
                  O sistema identificou que você é o marido.
                </p>

                <p className="mt-3 text-white/70">
                  Não há descontos disponíveis para essa categoria de usuário.
                  😂
                </p>

                <button
                  onClick={() => setShowNegotiationDenied(false)}
                  className="mt-6 rounded-full border border-white/20 px-8 py-4 font-bold hover:bg-white/10"
                >
                  Entendi 😅
                </button>
              </motion.div>
            )}

            {paymentAccepted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-green-400/20 bg-green-500/10 p-8"
              >
                <h3 className="mb-4 text-3xl font-bold text-green-300">
                  ✅ Pagamento aprovado
                </h3>

                <p className="mb-4 text-white/70">
                  Obrigado pela preferência.
                </p>

                <div className="mb-6 h-4 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-green-400"
                  />
                </div>

                <p className="text-white/70">
                  Conquistas desbloqueadas com sucesso.
                </p>

                <button
                  onClick={() => setStep("achievements")}
                  className="mt-6 rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899]"
                >
                  Ver conquistas 🏆
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === "achievements" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl space-y-8"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Sistema de conquistas
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Escaneando histórico do Bruno...
            </h2>

            <div className="mx-auto h-3 max-w-md overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-full bg-pink-400"
              />
            </div>

            <div className="space-y-4">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.45 }}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5 text-left backdrop-blur"
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.3em] text-pink-300">
                    Conquista desbloqueada
                  </p>

                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>

                    <div>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <p className="mt-1 text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + achievements.length * 0.45 }}
                className="rounded-2xl border border-pink-400/30 bg-pink-500/10 p-5 text-left backdrop-blur"
              >
                <p className="mb-1 text-xs uppercase tracking-[0.3em] text-pink-300">
                  Conquista bloqueada
                </p>

                <div className="flex items-start gap-4">
                  <span className="text-4xl">🔒</span>

                  <div>
                    <h3 className="text-2xl font-bold">Missão Especial</h3>
                    <p className="mt-1 text-white/60">
                      Esta conquista exige uma última verificação emocional.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <button
              onClick={() => setStep("special")}
              className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899]"
            >
              Continuar ❤️
            </button>
          </motion.div>
        )}

        {step === "special" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-2xl space-y-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-8xl"
            >
              🔒
            </motion.div>

            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Arquivo confidencial
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Missão Especial
            </h2>

            <p className="text-white/70">
              Esta conquista exige uma última verificação emocional...
            </p>

            <button
              onClick={switchToAnaJulia}
              className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899]"
            >
              Iniciar Projeto Ana Júlia ❤️
            </button>
          </motion.div>
        )}

        {step === "video" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-3xl space-y-6 text-center"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-pink-300">
              Projeto Ana Júlia
            </p>

            <h2 className="text-4xl font-bold">
              Antes mesmo dela nascer...
            </h2>

            <video
              src="/videos/ana-julia.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setStep("ending")}
              className="mx-auto max-h-[70vh] w-full rounded-3xl border border-white/10 shadow-2xl"
            />

            <p className="text-white/70">
              você já era exatamente o pai que ela precisava.
            </p>
          </motion.div>
        )}

        {step === "ending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-2xl space-y-6 text-center"
          >
            <div className="text-7xl">❤️</div>

            <p className="text-xl text-white/80">
              Obrigada por cuidar da Maria.
            </p>

            <p className="text-xl text-white/80">
              Obrigada por cuidar do Juninho.
            </p>

            <p className="text-xl text-white/80">
              Obrigada por amar a Ana Júlia antes mesmo de conhecê-la.
            </p>

            <p className="pt-4 text-2xl font-semibold text-pink-300">
              E obrigada por escolher ficar.
            </p>

            <button
              onClick={() => setStep("final")}
              className="mt-8 rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899]"
            >
              Fim?
            </button>
          </motion.div>
        )}

        {step === "final" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-2xl space-y-8 text-center"
          >
            <h2 className="text-5xl font-bold">Não 😏</h2>

            <p className="text-2xl text-white/80">
              Ainda temos uma vida inteira pela frente.
            </p>

            <div className="text-7xl">❤️</div>

            <p className="text-3xl font-bold text-pink-300">Te amo.</p>

            <p className="text-xl text-white/70">Luana.</p>

<div className="flex flex-col items-center justify-center gap-3 pt-6 md:flex-row">
  <button
    onClick={() => window.close()}
    className="rounded-full border border-white/20 px-8 py-4 font-bold hover:bg-white/10"
  >
    Fechar tela
  </button>

  <button
    onClick={() => {
      setStep("intro");
      setAttempts(0);
      setButtonPosition({ x: 0, y: 0 });
      setDate("");
      setError("");
      setNickname("");
      setAccessError("");
      setReportAnswer("");
      setShowPayment(false);
      setPaymentAccepted(false);
      setShowNegotiationDenied(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "/audio/mirrors.mp3";
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.25;
      }

      setMusicStarted(false);
    }}
    className="rounded-full bg-pink-500 px-8 py-4 font-bold shadow-[0_0_35px_#ec4899] hover:bg-pink-400"
  >
    Iniciar dnv?
  </button>
</div>
          </motion.div>
        )}
      </section>
    </main>
  );
}