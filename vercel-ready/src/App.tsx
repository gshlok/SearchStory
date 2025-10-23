import { Switch, Route } from "wouter";

export function App() {
  return (
    <div>
      <h1>Search Story - Algorithm Visualizer</h1>
      <Switch>
        <Route path="/">Home Page</Route>
        <Route path="/binary">Binary Search Visualizer</Route>
        <Route path="/linear">Linear Search Visualizer</Route>
      </Switch>
    </div>
  );
}