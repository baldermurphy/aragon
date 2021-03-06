import React from 'react'
import styled from 'styled-components'
import { DropDown, Button, Field, TextInput } from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'
import {
  getDefaultEthNode,
  getIpfsGateway,
  getSelectedCurrency,
  setDefaultEthNode,
  setIpfsGateway,
  setSelectedCurrency,
} from '../../local-settings'
import DaoSettings from './DaoSettings'
import Option from './Option'
import Note from './Note'

const Content = styled.div`
  max-width: 600px;
  padding: 30px;
`

// Only USD for now
const AVAILABLE_CURRENCIES = ['USD']

// If the currency isn’t available, get the first available instead.
const filterCurrency = currency => {
  currency = currency.toUpperCase()
  return AVAILABLE_CURRENCIES.indexOf(currency) > -1
    ? currency
    : AVAILABLE_CURRENCIES[0]
}

class Settings extends React.Component {
  static defaultProps = {
    daoAddr: '',
    account: '',
    apps: [],
  }
  state = {
    defaultEthNode: getDefaultEthNode(),
    ipfsGateway: getIpfsGateway(),
    currencies: AVAILABLE_CURRENCIES,
    selectedCurrency: filterCurrency(getSelectedCurrency()),
  }
  handleSelectedCurrencyChange = (index, currencies) => {
    setSelectedCurrency(currencies[index])
    this.setState({ selectedCurrency: currencies[index] })
  }
  handleDefaultEthNodeChange = event => {
    this.setState({ defaultEthNode: event.target.value })
  }
  handleIpfsGatewayChange = event => {
    this.setState({ ipfsGateway: event.target.value })
  }
  handleNodeSettingsSave = () => {
    const { defaultEthNode, ipfsGateway } = this.state
    setDefaultEthNode(defaultEthNode)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }
  handleRefreshCache = () => {
    window.localStorage.clear()
    window.location.reload()
  }
  render() {
    const { daoAddr, account, apps } = this.props
    const {
      defaultEthNode,
      ipfsGateway,
      currencies,
      selectedCurrency,
    } = this.state
    return (
      <AppLayout title="Settings">
        <Content>
          <DaoSettings daoAddr={daoAddr} apps={apps} account={account} />
          {currencies.length > 1 &&
            selectedCurrency && (
              <Option
                name="Currency"
                text={`
                  This will be the default currency for displaying purposes.
                  It will be converted to ETH under the hood.
                `}
              >
                <Field label="Select currency">
                  <DropDown
                    active={currencies.indexOf(selectedCurrency)}
                    items={currencies}
                    onChange={this.handleSelectedCurrencyChange}
                  />
                </Field>
              </Option>
            )}
          <Option
            name="Node settings (advanced)"
            text={`
              Change which Ethereum and IPFS clients this app is connected to
            `}
          >
            <Field label="Ethereum node">
              <TextInput
                onChange={this.handleDefaultEthNodeChange}
                wide
                value={defaultEthNode}
              />
            </Field>
            <Field label="IPFS gateway">
              <TextInput
                onChange={this.handleIpfsGatewayChange}
                wide
                value={ipfsGateway}
              />
            </Field>
            <Button mode="secondary" onClick={this.handleNodeSettingsSave}>
              Save settings
            </Button>
          </Option>
          <Option
            name="Troubleshooting"
            text={`
              Press this button to refresh the cache of the application in your
              browser.
            `}
          >
            <div>
              <Button mode="secondary" onClick={this.handleRefreshCache}>
                Clear application cache
              </Button>
            </div>
            <Note>
              This will only delete the data stored in your browser to make the
              app load faster. No data related to the organization itself will
              be altered.
            </Note>
          </Option>
        </Content>
      </AppLayout>
    )
  }
}

export default Settings
