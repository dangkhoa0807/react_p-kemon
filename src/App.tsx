import React, { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';
import PokemonCollection from './components/PokemonCollection';
import { Pokemon } from './interface';


interface Pokemons{
  name: string;
  url: string;
}

export interface Detail {
  id: number;
  isOpened: boolean;
}

const App: React.FC =()=>{
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false,
  });
  useEffect(()=>{
    
    const getpoke= async()=>{
      const res= await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20")

      setNextUrl(res.data.next);
      const pokemonData: Pokemon[] = [];
      for (const pokemon of res.data.results) {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        pokemonData.push(poke.data);
        setLoading(false);
      }

      setPokemons(pokemonData);
    }
    getpoke();
  },[]);

  const morePokemon=async ()=>{
    setLoading(true);
    const res= await axios.get(nextUrl);
    setNextUrl(res.data.next);
    res.data.results.forEach(async (pokemon:Pokemons) => {
      const poke= await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      
      setLoading(false);
      setPokemons((p)=> [...p,poke.data])
    });
  }
  return (
    <div className="App">
      <div className="container">
        <div className="pokemon-header">
          Pokemon
        </div>
          <PokemonCollection pokemons={pokemons} viewDetail={viewDetail} setDetail={setDetail}/>
          {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={morePokemon}>
              {loading ? "Loading..." : "Load more"}{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
