import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client'
import './app.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: {}
    };
  }
  componentDidMount() {
    fetch("https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result,
            token: result.EmbedToken.Token
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items, token} = this.state;
    const reactVersion = require('./package.json').dependencies['react'];
    const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';
    return ([
      <h1 key='mfe'>
        <img style={{ marginRight: "10px" }} src={logoUrl} height="30"></img>
        React MFE - with Power bi
      </h1>,
      <p key='version'>
        React Version: {reactVersion}
      </p>,
      //   <PowerBIEmbed
      //   embedConfig = {{
      //     type: 'report',   // Supported types: report, dashboard, tile, visual and qna
      //     id: '5b218778-e7a5-4d73-8187-f10824047715', 
      //     embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=5b218778-e7a5-4d73-8187-f10824047715&groupId=f089354e-8366-4e18-aea3-4cb4a3a50b48',
      //     accessToken: undefined,    // Keep as empty string, null or undefined
      //     tokenType: models.TokenType.Embed
      //   }}
      // />

      <PowerBIEmbed
        embedConfig={{
          type: 'report',   // Supported types: report, dashboard, tile, visual and qna
          id: items.Id,
          embedUrl: items.EmbedUrl,
          accessToken: token,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}

        eventHandlers={
          new Map([
            ['loaded', function () { console.log('Report loaded'); }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event) { console.log(event.detail); }]
          ])
        }

        cssClassName={"cont"}

        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    ])
  }
}

class ReactMfe extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(<App />, this);
  }
}

customElements.define('react-element', ReactMfe);