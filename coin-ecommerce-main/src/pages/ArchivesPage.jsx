import React, { useState, useEffect } from 'react';
import './ArchiveAuction.css';
import { FaFilePdf, FaGavel, FaTimes } from 'react-icons/fa';

const ArchiveAuction = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAuctionData, setSelectedAuctionData] = useState(null);
  const [realAuctions, setRealAuctions] = useState([]);
  const [demoArchives, setDemoArchives] = useState([]); // Will be fetched from database
  const [loading, setLoading] = useState(true);

  // ২. ডাটাবেস থেকে demo archives এবং real completed auctions fetch করা
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        // Fetch demo archives from database
        const demoResponse = await fetch('https://gangaridai-auction.onrender.com/api/demo-archives');
        const demoData = await demoResponse.json();

        // Format demo archives to match display structure
        const formattedDemoArchives = demoData.map(archive => ({
          id: archive._id,
          title: archive.title,
          date: archive.date,
          time: archive.time || '',
          image: archive.image,
          headerText: archive.headerText || '',
          catalogueLink: archive.catalogueLink || '',
          realization: archive.realization || [],
          isDemo: true
        }));

        setDemoArchives(formattedDemoArchives);

        // Fetch real completed auctions
        const response = await fetch('https://gangaridai-auction.onrender.com/api/auctions/archives');
        const data = await response.json();

        // Format the real auctions to match our display structure
        const formattedAuctions = data.map((auction, index) => ({
          id: auction._id,
          title: auction.name || `AUCTION #${formattedDemoArchives.length + index + 1}`,
          date: auction.displayDate || new Date(auction.dateString).toLocaleDateString(),
          time: "",
          image: auction.image || "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop",
          headerText: auction.name || "Completed Auction",
          catalogueLink: auction.pdfLink || "",
          totalLots: auction.totalLots || 0,
          isRealAuction: true,
          archiveId: auction._id // For fetching realization data
        }));

        setRealAuctions(formattedAuctions);
      } catch (error) {
        console.error("Error fetching archives:", error);
        setRealAuctions([]);
        setDemoArchives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  // ৩. Final List = Demo + Real Auctions
  const allArchives = [...demoArchives, ...realAuctions];

  // --- ফাংশন ১: ক্যাটালগ ওপেন করা ---
  const handleCatalogue = (link) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert("Catalogue PDF is not available right now.");
    }
  };

  // --- ফাংশন ২: রিয়ালাইজেশন (Realization) ওপেন করা ---
  const handleRealization = async (auction) => {
    // If it's a real auction, fetch realization data from backend
    if (auction.isRealAuction && auction.archiveId) {
      try {
        const response = await fetch(`https://gangaridai-auction.onrender.com/api/auctions/realization/${auction.archiveId}`);
        const data = await response.json();

        // Format realization data
        const formattedRealization = data.products.map(product => ({
          lot: product.lotNumber,
          name: product.name,
          price: product.isSold ? `৳ ${product.highestBid.toLocaleString()}` : "---",
          status: product.isSold ? "SOLD" : "UNSOLD"
        }));

        setSelectedAuctionData({
          ...auction,
          realization: formattedRealization
        });
      } catch (error) {
        console.error("Error fetching realization:", error);
        alert("Failed to load realization data");
        return;
      }
    } else {
      // Demo auction - use existing data
      setSelectedAuctionData(auction);
    }

    setShowModal(true);
  };

  const closeRealization = () => {
    setShowModal(false);
    setSelectedAuctionData(null);
  };

  return (
    <div className="archive-container">
      <div className="archive-header">
        <h2>Auction Archives</h2>
        <p className="subtitle">Past auction results and catalogues</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          Loading archives...
        </div>
      ) : (
        <div className="archive-grid">
          {allArchives.map((item) => (
            <div className="archive-card" key={item.id}>
              <div className="card-image-box">
                <div className="image-overlay-text">"{item.headerText}"</div>
                <img src={item.image} alt={item.title} className="card-img" />
              </div>

              <div className="card-details">
                <h3 className="auction-title">{item.title}</h3>
                <p className="auction-date">
                  {item.date} {item.time && `• ${item.time}`}
                </p>
                {item.totalLots > 0 && (
                  <p className="auction-lots" style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    {item.totalLots} Lots
                  </p>
                )}

                <div className="card-actions">
                  {/* Catalogue Button */}
                  <button
                    className="action-btn"
                    onClick={() => handleCatalogue(item.catalogueLink)}
                  >
                    <FaFilePdf /> Catalogue
                  </button>

                  {/* Realization Button */}
                  <button
                    className="action-btn"
                    onClick={() => handleRealization(item)}
                  >
                    <FaGavel /> Realization
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Realization Modal (Popup) --- */}
      {showModal && selectedAuctionData && (
        <div className="modal-overlay" onClick={closeRealization}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Realization: {selectedAuctionData.title}</h3>
              <button className="close-btn" onClick={closeRealization}><FaTimes /></button>
            </div>

            <div className="modal-body">
              {selectedAuctionData.realization && selectedAuctionData.realization.length > 0 ? (
                <table className="realization-table">
                  <thead>
                    <tr>
                      <th>Lot #</th>
                      <th>Item Description</th>
                      <th>Hammer Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAuctionData.realization.map((row, index) => (
                      <tr key={index}>
                        <td className="lot-no">{row.lot}</td>
                        <td>
                          {row.name}
                          {row.status === 'UNSOLD' && <span className="badge-unsold">Unsold</span>}
                        </td>
                        <td className="price">{row.status === 'SOLD' ? row.price : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No realization data available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveAuction;
