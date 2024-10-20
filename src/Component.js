import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [intCharacters, setIntCharacters] = useState([]); 
  const [selectedEpisode, setSelectedEpisode] = useState(null);


  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await axios.get('https://rickandmortyapi.com/api/episode');
        setEpisodes(res.data.results);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    const fetchintCharacters = async () => {
      try {
        const res = await axios.get('https://rickandmortyapi.com/api/character');
        setCharacters(res.data.results);
        setIntCharacters(res.data.results); // Store initial characters
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchEpisodes();
    fetchintCharacters();
  }, []);

  // Fetch characters when an episode is selected
  const handleEpisodeSelect = async (episodeId) => {
    // If the clicked episode is already selected, unselect it
    if (selectedEpisode === episodeId) {
      setSelectedEpisode(null); // Clear the selected episode
      setCharacters(intCharacters); // Revert to initial characters
      return;
    }

    setSelectedEpisode(episodeId);

    try {
      const episoderes = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeId}`);
      const characterUrls = episoderes.data.characters;

      const characterRequests = characterUrls.map(url => axios.get(url));
      const characterress = await Promise.all(characterRequests);
      
      setCharacters(characterress.map(res => res.data));
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  return (
    <div className="container-fluid">
        <h1 className='text-danger'>Rick And Morty </h1>
      <div className="row">
        {/* Episode List */}
        <div className="col-md-3">
          <h3 className='text-Dark'>Episodes</h3>
          <ul className="list-group">
            {episodes.map(episode => (
              <li
                key={episode.id}
                className={`list-group-item ${selectedEpisode === episode.id ? 'active' : ''}`}
                onClick={() => handleEpisodeSelect(episode.id)}
                style={{ cursor: 'pointer' }}
              >
                {episode.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Character Grid */}
        <div className="col-md-9">
          <h3 className='text-success'>Characters</h3>
          <div className="row">
            {characters.length > 0 ? (
              characters.map(character => (
                <div className="col-md-3 mb-4" key={character.id}>
                  <div className="card">
                    <img src={character.image} className="card-img-top" alt={character.name} />
                    <div className="card-body">
                      <h5 className="card-title">{character.name}</h5>
                      <p className="card-text">{character.species}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center"> NO DATA FOUND</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
