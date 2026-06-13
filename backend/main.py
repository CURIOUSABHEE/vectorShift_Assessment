from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    data = json.loads(pipeline)
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    num_nodes = len(nodes)
    num_edges = len(edges)

    adj = {n: [] for n in nodes}
    in_degree = {n: 0 for n in nodes}
    for edge in edges:
        s, t = edge['source'], edge['target']
        if s in adj and t in adj:
            adj[s].append(t)
            in_degree[t] = in_degree.get(t, 0) + 1

    queue = [n for n in nodes if in_degree.get(n, 0) == 0]
    count = 0
    while queue:
        u = queue.pop(0)
        count += 1
        for v in adj.get(u, []):
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    is_dag = count == num_nodes

    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
