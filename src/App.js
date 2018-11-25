import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import client from "./client";
import { ME, SEARCH_REPOSITORIES } from "./graphql";
import { list } from "postcss";

const PER_PAGE = 5;
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    });
  }

  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    });
  }

  render() {
    const { query, first, after, before, last } = this.state;
    console.log({ query });
    return (
      <ApolloProvider client={client}>
        <from>
          <input value={query} onChange={this.handleChange} />
        </from>
        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, after, before, last }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `${error}`;
            const search = data.search;
            const repositoryCount = search.repositoryCount;
            const repositoryCountoryUnit =
              repositoryCount === 1 ? "Repository" : "Repositories";

            const title = `GitHub Repositrories Search Results - ${repositoryCount} ${repositoryCountoryUnit}`;
            return (
              <React.Fragment>
                <h2>{title}</h2>
                <ul>
                  {search.edges.map((edge, index) => {
                    const node = edge.node;
                    return (
                      <li key={index}>
                        <a href={node.url} target="_blank">
                          {node.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                {search.pageInfo.hasNextPage === true ? (
                  <button onClick={this.goNext.bind(this, search)}>Next</button>
                ) : null}
              </React.Fragment>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
