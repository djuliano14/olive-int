import { useState, useEffect } from 'react'
import './App.css'
import './index.css'

function App() {

  const testData = [
    { breed: "Labrador Retriever", image: "https://picsum.photos/536/354" },
    { breed: "German Shepherd", image: "https://picsum.photos/536/354" },
    { breed: "Golden Retriever", image: "https://picsum.photos/536/354" },
    { breed: "Bulldog", image: "https://picsum.photos/536/354" },
    { breed: "Poodle", image: "https://picsum.photos/536/354" },
  ];

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/api/dogs?page=${page}`);
      const data = await response.json();
      console.log(data);
    }
    fetchData();
  }, [page]);

  return (
    <>
      <div>
        {testData.map((dog, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <img
              src={dog.image}
              alt={dog.breed}
              style={{ width: '300px', height: '300px', objectFit: 'cover', marginRight: '20px' }}
            />
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{dog.breed}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
