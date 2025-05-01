export function calculateQualityScore(caseItem) {
  const importanceLevels = {
    critical: ['title', 'data'],
    important: ['message', 'status'],
    optional: ['messages']
  };

  // Check for urgent keywords in messages
  const hasUrgentMessages = caseItem.messages?.some(msg => 
    ['important', 'critical', 'urgent', 'priority', 'asap', 'emergency', 'immediate', 'now', 'rush'].some(keyword => 
      msg.text?.toLowerCase().includes(keyword)
    )
  );

  // Set medium priority as default
  let importance = 'Medium';
  
  // Upgrade to high if all important fields are present
  if (importanceLevels.important.every(field => caseItem[field])) {
    importance = 'High';
  }
  
  // Downgrade to low if any critical field is missing
  if (!importanceLevels.critical.every(field => caseItem[field])) {
    importance = 'Low';
  }

  // Override with urgent status if found
  if (hasUrgentMessages) {
    return {
      score: 100,
      importance: 'Urgent',
      indicator: 'bg-red-100 text-red-800'
    };
  }

  return {
    score: importance === 'High' ? 90 : importance === 'Medium' ? 60 : 30,
    importance,
    indicator: importance === 'High' ? 'bg-blue-100 text-blue-800' : 
               importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
               'bg-gray-100 text-gray-800'
  };
}