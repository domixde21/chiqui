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

  const esquivarBoton = () => {
    // Calcula una posición aleatoria dentro del viewport del celular
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    
    setPosicionNo({
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
    });
  };

  const celebrar = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ffc0cb', '#ffffff'] // Colores románticos
    });
  };

  if (cargando) return <div className="h-screen w-full flex justify-center items-center bg-gray-900 text-white">Conectando a la base de datos...</div>;
  if (recuerdos.length === 0) return <div className="h-screen w-full flex justify-center items-center bg-gray-900 text-white">No hay datos.</div>;

  const recuerdo = recuerdos[indiceActual];

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col items-center border border-gray-700">
        
        {/* Etiqueta de la consola */}
        <div className="w-full flex justify-start mb-4">
          <span className="text-xs font-mono text-green-400 bg-gray-900 px-2 py-1 rounded">
             ~/memorias/fetch_data.sh
          </span>
        </div>

        <img 
          src={recuerdo.foto_url} 
          alt="Nosotros" 
          className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
        />
        
        <p className="text-lg text-center font-medium mb-8 px-2">
          {recuerdo.motivo}
        </p>

        <div className="w-full relative h-16 flex justify-center items-center">
          {recuerdo.es_propuesta ? (
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={celebrar}
                className="bg-green-500 hover:bg-green-600 font-bold py-3 px-8 rounded-lg text-lg shadow-lg z-10 transition-transform active:scale-95"
              >
                Sí
              </button>
              <button 
                style={posicionNo}
                onMouseEnter={esquivarBoton} // Para PC
                onTouchStart={esquivarBoton} // Para Celular
                className="bg-red-500 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-200"
              >
                No
              </button>
            </div>
          ) : (
            <button 
              onClick={siguienteRecuerdo} 
              className="bg-blue-600 hover:bg-blue-700 w-full font-mono py-3 rounded-lg text-sm shadow-lg active:scale-95 transition-transform"
            >
              &gt; fetch_next_record()
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;