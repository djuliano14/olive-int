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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/data?page=${page}`);
        const res = await response.json();
        console.log(res);
        if(res && res.status === "success" && res.data.length > 0) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("An error occurred while fetching data");
        }
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log("Data changed:", data);
  }, [data]);

  const handlePrevious = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage(prev => prev + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dogs</h1>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : (
          <>
            {data.length > 0 ? (
              data.map((dog: { image: string, breed: string }, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src={dog.image ? dog.image : 'https://picsum.photos/536/354'}
                    alt={dog.breed}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
                  />
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{dog.breed}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>No dogs found</div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px 0' }}>
              <button 
                onClick={handlePrevious} 
                disabled={page <= 1}
                style={{ 
                  padding: '8px 15px', 
                  marginRight: '10px',
                  background: page <= 1 ? '#e0e0e0' : '#4a90e2',
                  color: page <= 1 ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page <= 1 ? 'default' : 'pointer'
                }}
              >
                Previous
              </button>
              
              <div style={{ display: 'flex' }}>
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageClick(i + 1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      margin: '0 5px',
                      border: 'none',
                      borderRadius: '50%',
                      background: page === i + 1 ? '#4a90e2' : '#f0f0f0',
                      color: page === i + 1 ? 'white' : 'black',
                      fontWeight: page === i + 1 ? 'bold' : 'normal',
                      cursor: 'pointer',
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                style={{ 
                  padding: '8px 15px', 
                  marginLeft: '10px',
                  background: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
