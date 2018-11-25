import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import client from "./client";

const ME = gql`
  query me {
    user(login: "yoshimoto8") {
      name
      avatarUrl
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">hello graph ql</div>
        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `${error}`;
            return <div>{data.user.name}</div>;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
