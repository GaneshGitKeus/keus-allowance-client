import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function SopList({ data }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubProduct, setSelectedSubProduct] = useState("");
  const [openProduct, setOpenProduct] = useState(null);

  const categories = data.map((item) => item.product);

  const filteredData = selectedCategory
    ? data.filter((item) => item.product === selectedCategory)
    : data;

  const subProducts =
    filteredData.length > 0
      ? filteredData[0].productList.map((p) => ({
          name: p.productName,
          id: p.productId,
        }))
      : [];

  return (
    <div style={{ 
      backgroundColor: '#f5f7fa', 
      height: '100vh', 
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Fixed Header Container */}
      <div style={{
        position: 'sticky',
        top: -5,
        zIndex: 1000,
        backgroundColor: '#f5f7fa',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e0e6ed'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          padding: '20px 20px 0 20px'
        }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: '#1e5ba8', 
            color: 'white', 
            padding: '16px 20px', 
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            SOP Documents
          </div>

          {/* Dropdowns */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            paddingBottom: '20px'
          }}>
            <select
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e0e6ed',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#333',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubProduct("");
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <select
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e0e6ed',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#333',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
                value={selectedSubProduct}
                onChange={(e) => setSelectedSubProduct(e.target.value)}
              >
                <option value="">All Products</option>
                {subProducts.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards Container */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        padding: '5px 20px 40px 20px'
      }}>
        {/* Product Cards */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px'
        }}>
          {filteredData.map((category, i) => (
            <div key={i}>
              {category.productList
                .filter((prod) =>
                  selectedSubProduct ? prod.productId === selectedSubProduct : true
                )
                .map((prod) => (
                  <div
                    key={prod.productId}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                  >
                    {/* Product Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        backgroundColor: '#2c6bb3',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        userSelect: 'none'
                      }}
                      onClick={() =>
                        setOpenProduct(
                          openProduct === prod.productId ? null : prod.productId
                        )
                      }
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e5ba8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2c6bb3'}
                    >
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>
                        {prod.productName}
                      </span>
                      <span style={{ transition: 'transform 0.2s' }}>
                        {openProduct === prod.productId ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </span>
                    </div>

                    {/* SOP List */}
                    {openProduct === prod.productId && (
                      <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#fafbfc',
                        maxHeight: '400px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {prod.sops.map((sop, idx) => (
                            <div
                              onClick={() => window.open(sop.url, "_blank")}
                              key={idx}
                              style={{
                                padding: '14px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #e0e6ed',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                userSelect: 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f5ff';
                                e.currentTarget.style.borderColor = '#2c6bb3';
                                e.currentTarget.style.transform = 'translateX(4px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e0e6ed';
                                e.currentTarget.style.transform = 'translateX(0)';
                              }}
                            >
                              <p style={{ 
                                margin: 0, 
                                color: '#333', 
                                fontSize: '15px',
                                fontWeight: '500'
                              }}>
                                {sop.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}