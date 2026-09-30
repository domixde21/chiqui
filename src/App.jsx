import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import confetti from 'canvas-confetti';

function App() {
  const [recuerdos, setRecuerdos] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [posicionNo, setPosicionNo] = useState({ top: 'auto', left: 'auto', position: 'relative' });
  const [interactuado, setInteractuado] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchRecuerdos = async () => {
      try {
        const { data, error } = await supabase
          .from('recuerdos')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          setRecuerdos(data);
        }
      } catch (err) {
        console.error("Error al cargar Supabase:", err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchRecuerdos();
  }, []);

  const iniciarExperiencia = () => {
    setInteractuado(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  };

  const siguienteRecuerdo = () => {
    if (indiceActual < recuerdos.length - 1) setIndiceActual(indiceActual + 1);
  };

  const anteriorRecuerdo = () => {
    if (indiceActual > 0) setIndiceActual(indiceActual - 1);
  };

  const esquivarBoton = () => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    setPosicionNo({
      position: 'absolute',
      left: `${Math.max(20, x)}px`,
      top: `${Math.max(20, y)}px`,
    });
  };

  const celebrar = () => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#00a8ff', '#48dbfb', '#ffffff', '#0097e6', '#c7ecee'] 
    });
    
    setTimeout(() => {
      window.open("https://www.youtube.com/watch?v=LA3tSuTXb6Q&list=RDLA3tSuTXb6Q&start_radio=1", "_blank");
    }, 2500);
  };

  if (cargando) return (
    <div className="h-screen w-full flex justify-center items-center bg-blue-50 text-blue-800 text-lg animate-pulse font-medium">
      Preparando algo especial para ti... 💙
    </div>
  );
  
  if (recuerdos.length === 0) return (
    <div className="h-screen w-full flex justify-center items-center bg-blue-50 text-blue-800">
      No se encontraron recuerdos en la base de datos.
    </div>
  );

  const recuerdo = recuerdos[indiceActual];
  // Validación de seguridad por si algún campo viene undefined
  const mostrarMotivo = recuerdo?.motivo && recuerdo.motivo.trim() !== 'NULL' && recuerdo.motivo.trim() !== '';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-white to-cyan-200 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      
      {/* Audio nativo con enlace directo estable (puedes cambiar el src por un MP3 tuyo en Supabase) */}
      <audio ref={audioRef} loop>
        <source src="https://gjeuiksktfhggzlywhtq.supabase.co/storage/v1/object/public/fotos/NuestraCancion.mp3" type="audio/mpeg" />
      </audio>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(110vh) scale(0.5) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1.2) rotate(360deg); opacity: 0; }
        }
        .corazon-flotante {
          position: absolute;
          animation: floatUp linear infinite;
          z-index: 0;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .tarjeta-flotante {
          animation: floatCard 6s ease-in-out infinite;
        }
        @keyframes latido {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .btn-latido {
          animation: latido 1.5s infinite ease-in-out;
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Corazones de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="corazon-flotante text-2xl sm:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          >
            {['💙', '🩵', '🤍'][i % 3]}
          </div>
        ))}
      </div>

      {/* PANTALLA INICIAL */}
      {!interactuado ? (
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,119,255,0.3)] p-10 flex flex-col items-center border-2 border-white/80 z-10 tarjeta-flotante fade-in">
          <div className="text-6xl mb-6 btn-latido">💌</div>
          <h1 className="text-2xl text-center text-blue-950 font-bold mb-8">Tengo algo para ti...</h1>
          <button 
            onClick={iniciarExperiencia}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-10 rounded-2xl text-xl shadow-[0_10px_20px_rgba(34,211,238,0.4)] active:scale-95 transition-all border border-cyan-300/50 w-full"
          >
            Abrir 🩵
          </button>
        </div>
      ) : (
        /* TARJETA PRINCIPAL */
        <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,119,255,0.3)] p-6 sm:p-8 flex flex-col items-center border-2 border-white/80 transition-all duration-500 z-10 tarjeta-flotante">
          
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <button 
              onClick={anteriorRecuerdo} 
              disabled={indiceActual === 0}
              className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
                indiceActual === 0 
                ? 'opacity-30 cursor-not-allowed text-slate-400' 
                : 'bg-white/80 text-blue-600 shadow-sm hover:bg-white active:scale-95'
              }`}
            >
              &larr; Volver
            </button>

            <div className="flex gap-1.5 bg-white/50 px-3 py-1.5 rounded-full shadow-inner">
              {recuerdos.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === indiceActual 
                    ? 'w-6 bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' 
                    : 'w-1.5 bg-blue-200'
                  }`}
                />
              ))}
            </div>

            <div className="w-12"></div>
          </div>

          <div className="relative w-full aspect-[4/5] mb-6 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white bg-slate-50 group">
            <img 
              key={`img-${recuerdo?.id}`} 
              src={recuerdo?.foto_url} 
              alt="Nosotros" 
              className="w-full h-full object-cover fade-in transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"></div>
          </div>
          
          <div className="min-h-[5rem] flex items-center justify-center w-full mb-6 px-2">
            {mostrarMotivo && (
              <p 
                key={`text-${recuerdo?.id}`} 
                className="text-xl sm:text-2xl text-center text-blue-950 font-semibold leading-relaxed fade-in drop-shadow-sm"
              >
                {recuerdo.motivo}
              </p>
            )}
          </div>

          {/* Controles inferiores (Botón de siguiente o propuesta con opción de volver siempre arriba) */}
          <div className="w-full relative min-h-[4rem] flex justify-center items-center">
            {recuerdo?.es_propuesta ? (
              <div className="flex flex-col gap-3 w-full items-center fade-in">
                <div className="flex gap-4 w-full justify-center">
                  <button 
                    onClick={celebrar}
                    className="btn-latido bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-extrabold py-3.5 px-10 rounded-2xl text-xl shadow-[0_10px_20px_rgba(34,211,238,0.4)] z-10 transition-transform active:scale-90 border-2 border-white/50"
                  >
                    Sí 🩵
                  </button>
                  <button 
                    style={posicionNo}
                    onMouseEnter={esquivarBoton} 
                    onTouchStart={esquivarBoton}
                    className="bg-white/80 text-blue-300 font-medium py-3.5 px-6 rounded-2xl text-lg shadow-sm border border-blue-100 backdrop-blur-sm transition-all duration-200"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full fade-in">
                <button 
                  onClick={siguienteRecuerdo} 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3.5 rounded-2xl text-base font-bold shadow-[0_10px_20px_rgba(34,211,238,0.3)] active:scale-95 transition-all border border-cyan-300/50"
                >
                  Siguiente &rarr;
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;