/**
 * Productivity Metrics Map
 * Copyright (c) 2025 [Your Name]
 * MIT License
 */

import React, { useState } from 'react';
import _ from 'lodash';

// Import data from separated files
import conceptData, { ellipsePositions, groupColors } from '../data/concept-data';
import translations from '../data/translations';
import conceptDetails from '../data/concept-details';

const ProductivityMetricsMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [language, setLanguage] = useState('en');

  // Helper functions
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  const format = (str, ...args) => {
    return str.replace(/{(\d+)}/g, (match, number) => 
      typeof args[number] !== 'undefined' ? args[number] : match
    );
  };

  const getTranslatedName = (conceptId) => {
    return conceptDetails[language][conceptId]?.name || conceptId;
  };

  const getTranslatedConcept = (conceptId) => {
    return conceptDetails[language][conceptId] || { 
      name: conceptId, 
      definition: "", 
      measurement: "" 
    };
  };

  // Get relationship strength for line thickness
  const getRelationshipStrength = (concept1, concept2) => {
    const concept1Data = conceptData.find(c => c.id === concept1);
    const concept2Data = conceptData.find(c => c.id === concept2);
    
    if (!concept1Data || !concept2Data) return 0;
    
    // Special cases for specific relationships
    if ((concept1 === "Performance" && concept2 === "Impact") ||
        (concept1 === "Impact" && concept2 === "Performance") ||
        (concept1 === "Wirksamkeit" && concept2 === "Effectiveness") ||
        (concept1 === "Effectiveness" && concept2 === "Wirksamkeit")) {
      return 5; // Maximum strength
    }
    
    const isBidirectional = concept1Data.overlaps.includes(concept2) && 
                          concept2Data.overlaps.includes(concept1);
                          
    const isUnidirectional = concept1Data.overlaps.includes(concept2) || 
                           concept2Data.overlaps.includes(concept1);
    
    if (isBidirectional) return 4;
    if (isUnidirectional) return 3;
    
    // Check for common relationships
    const commonRelationships = _.intersection(concept1Data.overlaps, concept2Data.overlaps);
    return commonRelationships.length > 0 ? 2 : 0;
  };

  // Find related nodes
  const findRelatedNodes = (conceptId) => {
    const concept = conceptData.find(c => c.id === conceptId);
    if (!concept) return [];
    
    return conceptData
      .filter(c => concept.overlaps.includes(c.id) || c.overlaps.includes(conceptId))
      .map(c => c.id);
  };

  const relatedNodes = selectedNode ? findRelatedNodes(selectedNode) : [];
  const selectedConcept = conceptData.find(c => c.id === selectedNode);

  // Text layout helper
  const renderConceptText = (concept, translatedName, isSelected) => {
    if (translatedName.length > 10 && translatedName.includes(" ")) {
      // Split text into two lines for longer names with spaces
      const words = translatedName.split(" ");
      let firstHalf = [];
      let secondHalf = [];
      let totalLength = 0;
      
      // Distribute words to create balanced lines
      words.forEach(word => {
        if (totalLength + word.length < translatedName.length / 2) {
          firstHalf.push(word);
          totalLength += word.length + 1;
        } else {
          secondHalf.push(word);
        }
      });
      
      // Handle case where all words went into first half
      if (secondHalf.length === 0 && firstHalf.length > 1) {
        secondHalf.push(firstHalf.pop());
      }
      
      const line1 = firstHalf.join(" ");
      const line2 = secondHalf.join(" ");
      
      return (
        <>
          <text 
            x={concept.position.x} 
            y={concept.position.y - 4} 
            textAnchor="middle" 
            alignmentBaseline="middle"
            fill={isSelected ? "white" : "#334155"}
            fontSize={isSelected ? "7" : "6"}
            fontWeight={isSelected ? "bold" : "normal"}
          >
            {line1}
          </text>
          <text 
            x={concept.position.x} 
            y={concept.position.y + 4} 
            textAnchor="middle" 
            alignmentBaseline="middle"
            fill={isSelected ? "white" : "#334155"}
            fontSize={isSelected ? "7" : "6"}
            fontWeight={isSelected ? "bold" : "normal"}
          >
            {line2}
          </text>
        </>
      );
    } else {
      // Single line for shorter names
      return (
        <text 
          x={concept.position.x}
          y={concept.position.y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={isSelected ? "white" : "#334155"}
          fontSize={isSelected ? "8" : "7"}
          fontWeight={isSelected ? "bold" : "normal"}
        >
          {translatedName}
        </text>
      );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Language switcher */}
      <div className="flex justify-end mb-2">
        <div className="bg-white rounded-lg shadow-sm inline-flex">
          {['en', 'de', 'cs'].map(lang => (
            <button 
              key={lang}
              className={`px-3 py-1 ${language === lang ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'} 
                ${lang === 'en' ? 'rounded-l-lg' : ''} 
                ${lang === 'cs' ? 'rounded-r-lg' : ''} 
                ${lang === 'de' ? 'border-l border-r' : ''}`}
              onClick={() => setLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">{t('title')}</h2>
      
      <div className="flex flex-col gap-6 h-full">
        {/* Visualization section */}
        <div className="w-full bg-white rounded-lg shadow-sm p-4 min-h-96 relative">
          <svg viewBox="-10 -10 220 220" className="w-full h-full" style={{ minHeight: "400px" }}>
            {/* Connection lines between nodes - MOVED TO BACKGROUND with increased transparency */}
            {conceptData.flatMap(source => 
              source.overlaps.map(targetId => {
                const target = conceptData.find(c => c.id === targetId);
                if (!target) return null;
                
                const isHighlighted = selectedNode && 
                  (source.id === selectedNode || targetId === selectedNode);
                
                const strength = getRelationshipStrength(source.id, targetId);
                
                return (
                  <line 
                    key={`${source.id}-${targetId}`}
                    x1={source.position.x}
                    y1={source.position.y}
                    x2={target.position.x}
                    y2={target.position.y}
                    stroke={"#94a3b8"}
                    strokeWidth={strength > 0 ? 0.8 : 0.3}
                    strokeDasharray={strength > 3 ? "none" : "2,2"}
                    opacity={0.1}
                  />
                );
              })
            )}

            {/* Main areas for concept groups - rounded rectangles */}
            {Object.entries(ellipsePositions).map(([group, {cx, cy, rx, ry}]) => {
              const width = rx * 2;
              const height = ry * 2;
              const x = cx - rx;
              const y = cy - ry;
              const cornerPct = 0.8;
              const cornerRx = rx * cornerPct;
              const cornerRy = ry * cornerPct;
              
              return (
                <rect
                  key={group}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={cornerRx}
                  ry={cornerRy}
                  fill={groupColors[group]}
                  fillOpacity="0.2"
                  stroke={groupColors[group]}
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Group labels */}
            {Object.entries(ellipsePositions).map(([group, {cx, cy}]) => {
              // Custom positioning for each group title
              let xPos = cx;
              let yPos = cy - 50;
              
              // Create darker versions of the group colors for better readability
              const darkerColors = {
                resource: "#3730A3", // Darker indigo
                outcome: "#0D9488", // Darker teal
                value: "#b85e1a"    // Darker orange
              };
              
              if (group === 'resource') {
                // Move Resource Utilization closer to blue rectangle
                yPos = cy - 45;
              } else if (group === 'outcome') {
                // Move Outcome Achievement closer to green rectangle
                yPos = cy - 45;
              } else if (group === 'value') {
                // Adjusted position for Value Creation
                xPos = 55;
                yPos = 110;
              }
              
              return (
                <text 
                  key={group}
                  x={xPos}
                  y={yPos}
                  textAnchor="middle"
                  fill={darkerColors[group]}
                  fontSize="8"
                  fontWeight="bold"
                >
                  {t(`groupNames.${group}`)}
                </text>
              );
            })}
            
            {/* Concept nodes */}
            {conceptData.map(concept => {
              const isSelected = selectedNode === concept.id;
              const isRelated = relatedNodes.includes(concept.id);
              const translatedName = getTranslatedName(concept.id);
              
              return (
                <g
                  key={concept.id}
                  onMouseEnter={() => setHoveredNode(concept.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(concept.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <ellipse 
                    cx={concept.position.x}
                    cy={concept.position.y}
                    rx={isSelected ? 25 : 22}
                    ry={isSelected ? 14 : 10}
                    fill={isSelected 
                      ? groupColors[concept.group] 
                      : (isRelated 
                        ? `${groupColors[concept.group]}dd` 
                        : `${groupColors[concept.group]}99`)}
                    stroke={isSelected || hoveredNode === concept.id ? "#334155" : "none"}
                    strokeWidth="2"
                    opacity={selectedNode && !isSelected && !isRelated ? 0.5 : 1}
                  />
                  
                  {renderConceptText(concept, translatedName, isSelected)}
                </g>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 p-2 rounded text-xs">
            {Object.entries(groupColors).map(([group, color]) => (
              <div key={group} className="flex items-center mb-1 last:mb-0">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{backgroundColor: color}}
                />
                <span>{t(`groupNames.${group}`)}</span>
              </div>
            ))}
          </div>
          
          {/* Quick info tooltip */}
          {hoveredNode && !selectedNode && (
            <div 
              className="absolute p-2 bg-white shadow-md rounded-md text-sm z-10"
              style={{
                left: `${conceptData.find(c => c.id === hoveredNode)?.position.x || 0}px`,
                top: `${conceptData.find(c => c.id === hoveredNode)?.position.y || 0}px`,
                transform: 'translate(30px, -10px)'
              }}
            >
              <div className="font-semibold">{getTranslatedName(hoveredNode)}</div>
              <div className="text-xs text-gray-600 mt-1">{getTranslatedConcept(hoveredNode).definition}</div>
            </div>
          )}
        </div>
        
        {/* Info panel section - Now as a full-width panel below */}
        <div className="w-full bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            {selectedNode 
              ? getTranslatedName(selectedNode) 
              : t('uiLabels.selectConcept')}
          </h3>
          
          {selectedNode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">{t('uiLabels.definition')}</h4>
                <p>{getTranslatedConcept(selectedNode).definition}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700">{t('uiLabels.measurement')}</h4>
                <p>{getTranslatedConcept(selectedNode).measurement}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700">{t('uiLabels.overlaps')}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedConcept?.overlaps.map(overlappingId => (
                    <span 
                      key={overlappingId}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                      onClick={() => setSelectedNode(overlappingId)}
                    >
                      {getTranslatedName(overlappingId)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-3">
                <h4 className="font-medium text-gray-700 mb-2">{t('uiLabels.relationships')}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {format(t('uiLabels.relatedConcepts'), getTranslatedName(selectedNode))}
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedNodes.map(relatedNode => (
                    <button 
                      key={relatedNode}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-sm hover:bg-blue-100"
                      onClick={() => setSelectedNode(relatedNode)}
                    >
                      {getTranslatedName(relatedNode)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">{t('uiLabels.selectConceptDetails')}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>{t('uiLabels.clickTip')}</p>
        <p className="mt-1">{t('uiLabels.lineTip')}</p>
      </div>
    </div>
  );
};

export default ProductivityMetricsMap;
