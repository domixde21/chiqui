import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import confetti from 'canvas-confetti';

function App() {
  const [recuerdos, setRecuerdos] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [posicionNo, setPosicionNo] = useState({ top: 'auto', left: 'auto', position: 'relative' });

  useEffect(() => {
    const fetchRecuerdos = async () => {
      const { data, error } = await supabase
        .from('recuerdos')
        .select('*')
        .order('id', { ascending: true });
      
      if (!error && data) {
        setRecuerdos(data);
      }
      setCargando(false);
    };
    fetchRecuerdos();
  }, []);

  const siguienteRecuerdo = () => {
    if (indiceActual < recuerdos.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const anteriorRecuerdo = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const esquivarBoton = () => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    
    setPosicionNo({
      position: 'absolute',
      left: `${Math.max(10, x)}px`,
      top: `${Math.max(10, y)}px`,
    });
  };

  const celebrar = () => {
    // Confeti en tonos azules, celestes y blancos
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00a8ff', '#48dbfb', '#ffffff', '#0097e6', '#c7ecee'] 
    });
    
    // Redirigir a la playlist de YouTube después de 2.5 segundos
    setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=LA3tSuTXb6Q&list=RDLA3tSuTXb6Q&start_radio=1";
    }, 2500);
  };

  if (cargando) return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-950 to-cyan-950 text-cyan-200 font-mono text-xl animate-pulse">
      Conectando a la API de recuerdos...
    </div>
  );
  
  if (recuerdos.length === 0) return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-950 to-cyan-950 text-cyan-200">
      No se encontraron registros.
    </div>
  );

  const recuerdo = recuerdos[indiceActual];
  
  // Lógica para no mostrar el texto si en Supabase dice "NULL" o está vacío
  const mostrarMotivo = recuerdo.motivo && recuerdo.motivo.trim() !== 'NULL' && recuerdo.motivo.trim() !== '';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 text-white flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* Estilos inyectados para las animaciones fluidas al cambiar de foto */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animar-entrada { animation: fadeUp 0.6s ease-out forwards; }
      `}</style>

      {/* Tarjeta principal con efecto Glassmorphism */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.15)] p-5 flex flex-col items-center border border-cyan-400/30 relative overflow-hidden transition-all duration-500">
        
        {/* Barra superior decorativa */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-white"></div>

        {/* Cabecera / Consola */}
        <div className="w-full flex justify-between items-center mb-5 mt-2">
          <span className="text-[10px] font-mono text-cyan-300 bg-blue-950/60 px-3 py-1 rounded-full border border-cyan-500/30 shadow-inner">
            ~/src/memoria_{indiceActual + 1}.tsx
          </span>
          <span className="text-xs font-mono text-cyan-200 font-semibold bg-white/5 px-2 py-1 rounded-lg">
            {indiceActual + 1} / {recuerdos.length}
          </span>
        </div>

        {/* Contenedor de la Imagen */}
        <div className="relative w-full aspect-[4/5] mb-5 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-cyan-500/20 group bg-blue-900/20">
          <img 
            key={recuerdo.id} 
            src={recuerdo.foto_url} 
            alt="Nuestra foto" 
            className="w-full h-full object-cover animar-entrada transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        {/* Texto Dinámico */}
        <div className="min-h-[3rem] flex items-center justify-center w-full mb-5">
          {mostrarMotivo && (
            <p key={`text-${recuerdo.id}`} className="text-lg text-center font-medium text-cyan-50 drop-shadow-lg animar-entrada">
              {recuerdo.motivo}
            </p>
          )}
        </div>

        {/* Controles y Botones */}
        <div className="w-full relative min-h-[4rem] flex justify-center items-center">
          {recuerdo.es_propuesta ? (
            <div className="flex gap-4 w-full justify-center animar-entrada">
              <button 
                onClick={celebrar}
                className="bg-cyan-500 hover:bg-cyan-400 text-blue-950 font-extrabold py-3 px-10 rounded-xl text-xl shadow-[0_0_20px_rgba(34,211,238,0.6)] z-10 transition-all active:scale-95 hover:shadow-[0_0_30px_rgba(34,211,238,0.9)]"
              >
                Sí 💙
              </button>
              <button 
                style={posicionNo}
                onMouseEnter={esquivarBoton} 
                onTouchStart={esquivarBoton}
                // Botón "No" en un tono neutro/oscuro para evitar el rojo
                className="bg-slate-700/80 text-slate-300 font-bold py-3 px-8 rounded-xl text-lg border border-slate-600 backdrop-blur-sm transition-all duration-200"
              >
                No
              </button>
            </div>
          ) : (
            <div className="flex gap-3 w-full animar-entrada">
              <button 
                onClick={anteriorRecuerdo} 
                disabled={indiceActual === 0}
                className={`flex-1 font-mono py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center ${
                  indiceActual === 0 
                  ? 'bg-blue-900/20 text-cyan-800/30 cursor-not-allowed border border-blue-800/20' 
                  : 'bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border border-cyan-700/50 active:scale-95'
                }`}
              >
                &lt; back()
              </button>
              
              <button 
                onClick={siguienteRecuerdo} 
                className="flex-[2] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono py-3 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)] active:scale-95 transition-all border border-cyan-400/50"
              >
                fetch_next() &gt;
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;