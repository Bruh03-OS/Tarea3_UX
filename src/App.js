import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [queHacer, setQueHacer] = useState([]);
  const [nQueHacer, setNQueHacer] = useState('');
  const [borrado, setBorrado] = useState(false);
  const [seleccionado, setSeleccionado] = useState([]);
  const [alerta, setAlerta] = useState('');

  const cambioDeValor = (e) => {
    setNQueHacer(e.target.value);
  };

  const mostrarAlerta = (mensaje) => {
    setAlerta(mensaje);
    setTimeout(() => {
      setAlerta('');
    }, 2000); // 2000 ms = 2 segundos
  };

  const adicionQueHacer = () => {
    if(nQueHacer.trim() !== '') {
      const nuevoQueHacer = {
        tarea: nQueHacer,
        completed: false
      }
      setQueHacer([...queHacer, nuevoQueHacer]);
      setNQueHacer('');
      if (!borrado && queHacer.length === 0) {
        setBorrado(true);
      }
      localStorage.setItem('queHacer', JSON.stringify([...queHacer, nuevoQueHacer]));
    }
  };

  const tareaCompletada = (index) => {
    const tareasCompletadas = [...queHacer];
    tareasCompletadas[index].completed = !tareasCompletadas[index].completed;

    if(seleccionado.includes(index)){
      setSeleccionado(seleccionado.filter((queHacerIndex) => queHacerIndex !== index))
    } else {
      setSeleccionado([...seleccionado, index]);
    }

    setQueHacer(tareasCompletadas);
    localStorage.setItem('queHacer', JSON.stringify(tareasCompletadas));
  };

  const queSeBorreTODO = () => {
    setQueHacer([]);
    setBorrado(false);
    setSeleccionado([]);
    localStorage.setItem('queHacer', JSON.stringify([]));
  };

  const queSeBorreLoSeleccionado = () => {
    if (seleccionado.length === 0) {
      mostrarAlerta('No hay elementos seleccionados...');
      return;
    }

    const completados = queHacer.filter((_, index) => !seleccionado.includes(index));
    setQueHacer(completados);
    setSeleccionado([]);
    localStorage.setItem('queHacer', JSON.stringify(completados));
  };

  useEffect(() => {
    const almacenado = localStorage.getItem('queHacer');
    if (almacenado) {
      setQueHacer(JSON.parse(almacenado));
      setBorrado(true);
    }
  }, []);

  return (
    <div className='contenedor-de-todo'>
      <h1>Lista de QueHaceres</h1>

      <input type='text' value={nQueHacer} onChange={cambioDeValor}/>
      <button onClick={adicionQueHacer} style={{marginTop:'10px'}}>Crear Nuevo</button>

      <ul className='contenido-lista'>
        {queHacer.map((queHaceres, index) => (

          <li key={index}>
            <input 
              type='checkbox' 
              checked={queHaceres.completed} 
              onChange={() => tareaCompletada(index)}/>
              {queHaceres.tarea}
          </li>

        ))}

      </ul>
      {borrado && queHacer.length > 0 &&(

        <div className='botones-de-borrado'>
          <button className='bb1' onClick={queSeBorreTODO}>Exterminio Total</button>
          <button className='bb1' onClick={queSeBorreLoSeleccionado} style={{marginLeft:'10px'}}>Exterminio Selectivo</button>
        </div>

      )}
      {alerta && (
        <div className='alerta'>
          <p>{alerta}</p>
        </div>
      )}
    </div>
  );
  
}

export default App;
