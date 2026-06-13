// dagUtils.js
// Validation helper for pipeline directed acyclic graphs (DAG)
// ----------------------------------------------------------------

export const checkIsDAG = (nodesList, edgesList) => {
  const adj = {};
  const inDegree = {};
  
  nodesList.forEach(node => {
    adj[node.id] = [];
    inDegree[node.id] = 0;
  });
  
  edgesList.forEach(edge => {
    if (adj[edge.source] && adj[edge.target]) {
      adj[edge.source].push(edge.target);
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    }
  });
  
  const queue = [];
  nodesList.forEach(node => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  });
  
  let count = 0;
  while (queue.length > 0) {
    const u = queue.shift();
    count++;
    
    (adj[u] || []).forEach(v => {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    });
  }
  
  return count === nodesList.length;
};
