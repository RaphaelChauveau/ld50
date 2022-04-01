console.log('START');

// pathfinding algorithm to navigate through polygonal shapes
// shape = set of points
// point = x y coordinate


const getSides = (shape) => {
  const sides = [];
  for (let i = 0; i < shape.length; i++) {
    const side = [];
    side.push(shape[i]);
    if (i === shape.length - 1) {
      side.push(shape[0]);
    } else {
      side.push(shape[i + 1]);
    }
    sides.push(side);
  }
  return sides;
};

const makeShape = (vertices) => ({
  vertices,
  edges: getSides(vertices),
});

const getSegmentIntersection = (ab, cd) => {
  // https://openclassrooms.com/forum/sujet/calcul-du-point-d-intersection-de-deux-segments-21661 18 mars 2009 à 17:52:32
  const [[ax, ay], [bx, by]] = ab;
  const [[cx, cy], [dx, dy]] = cd;
  const [ix, iy] = [bx - ax, by - ay]; // vector ab
  const [jx, jy] = [dx - cx, dy - cy]; // vector cd

  const denom = ix*jy - iy*jx;
  if (denom === 0) { // parallel
    return null
  }
  const m = -(-ix*ay + ix*cy + iy*ax - iy*cx) / denom;
  const k = -(ax*jy - cx*jy - jx*ay + jx*cy) / denom;
  if (m <= 1 && m >= 0 && k <= 1 && k >= 0) {
    return [px, py] = [ax + k * ix, ay + k * iy];
  }
  return null
};

const getDistTwoPoints = ([ax, ay], [bx, by]) => {
  const xDiff = bx - ax;
  const yDiff = by - ay;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

const getExtremeVertices = (start, end, obstacle) => {
  // TODO multiple vertex might have same angle, keep closest
  let angleMin;
  let leftVertex;
  let angleMax;
  let rightVertex;
  const [dx, dy] = [[end[0] - start[0]], [end[1] - start[1]]];
  for (const vertex of obstacle.vertices) {
    /*if (vertex[0] === start[0] && vertex[1] === start[1]) {
        continue; // same vertex
    }
    if (vertex[0] === end[0] && vertex[1] === end[1]) {
        continue; // same vertex
    }*/
    const [vx, vy] = [[vertex[0] - start[0]], [vertex[1] - start[1]]];
    const angle = Math.acos(dx * vx + dy * vy);
    if (angleMin === undefined || angle < angleMin) {
      angleMin = angle;
      leftVertex = vertex;
    } else if (angleMax === undefined || angle > angleMax) {
      angleMax = angle;
      rightVertex = vertex;
    }
  }
  return [leftVertex, rightVertex]
};

// TODO if = start or end, doesn't count
const findClosestIntersection = (start, end, obstacles) => {
  let closestDist;
  let closestObstacle;
  for (const obstacle of obstacles) {
    for (const obstacleEdges of obstacle.edges) {
      const intersection = getSegmentIntersection([start, end], obstacleEdges);
      // console.log(intersection);
      if (intersection) {
        if (intersection[0] === start[0] && intersection[1] === start[1]) {
          continue;
        }
        if (intersection[0] === end[0] && intersection[1] === end[1]) {
          continue;
        }
        const dist = getDistTwoPoints(start, intersection);
        if (closestDist === undefined || dist < closestDist) {
          closestDist = dist;
          closestObstacle = obstacle;
        }
        // console.log(dist);
      }
    }
  }
  return closestObstacle;
};

const findObstacles = (start, end, shapes) => {
  const obstacles = [];
  for (const shape of shapes) {
    for (const shapeEdges of shape.edges) {
      const intersection = getSegmentIntersection([start, end], shapeEdges);
      // console.log(intersection);
      if (intersection) {
        let startIntersect = false;
        let stopIntersect = false;
        if (intersection[0] === start[0] && intersection[1] === start[1]) {
          startIntersect = true;
        }
        if (intersection[0] === end[0] && intersection[1] === end[1]) {
          stopIntersect = true;
        }
        if ((startIntersect && !stopIntersect) ||
          (!startIntersect && stopIntersect)) {
          continue;
        }

        obstacles.push(shape);
      }
    }
  }
  return obstacles;
};

const vertexInList = ([vx, vy], list) => {
  for (const [ex, ey] in list) {
    if (ex === vx && ey === vy) {
      return true;
    }
  }
  return false;
};

// todo if not exist OR better hope
const addNode = (nodes, end, point, cost, path) => {
  nodes[`${start[0]}:${start[1]}`] = {
      point,
      cost,
      hope: getDistTwoPoints(start, end),
      path,
      visited: false, // TODO will be used ?
    }
};

// TODO might make this more efficient if we also keep a list of nodes
// ordered by hope
const pickBestNode = (nodes) => {
  let bestHope = Infinity;
  let bestNode = null;
  for (const node of Object.values(nodes)) {
    if (node.hope < bestHope) {
      bestHope = node.hope;
      bestNode = node;
    }
  }
  bestNode.visited = true;
  return bestNode;
};

const findPath = (start, end, shapes) => {
  const nodes = {};
  addNode(nodes, end, start, 0, []);
  console.log(nodes);

  while (Object.keys(nodes).length > 0) {
    // pick node with best hopes
    const currentNode = pickBestNode(nodes);
    console.log(currentNode);

    // if can go to end
    //   return [...currentNode.path, currentNode]
    // else
    //   foreach obstacles:
    //     get possible jumps
    //   foreach possible jumps:
    //     if can go to possible jump:
    //       nodes.add(possible jump)
    //     else:
    //
    break;
  }
};

//S
// 12
// 43
//   E
const shape1 = makeShape([
  [1, 1],
  [2, 1],
  [2, 2],
  [1, 2],
]);
const shapes = [shape1];
const start = [0, 0];
const end = [3, 3];
findPath(start, end, shapes, []);