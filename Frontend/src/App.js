import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BaseLayout from "./components/BaseLayout";
import HomePage from "./Home";
import Login from "./login";
import Signup from "./signup";
import { useState } from "react";
import AuhthContext from "./components/context/context";
import Expense from "./Expense";
import Donate from "./Donate";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  function PublicRouter() {
    return (
      <>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
          </Routes>
        </BaseLayout>
      </>
    );
  }
  function PrivateRouter({ signout }) {
    return (
      <>
        <Header signout={signout} />
        <BaseLayout>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </BaseLayout>
      </>
    );
  }

  return (
    <AuhthContext.Provider
      value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router className="App">
        {!token ? <PublicRouter /> : <PrivateRouter signout={logout} />}
      </Router>
    </AuhthContext.Provider>
  );
}

export default App;
