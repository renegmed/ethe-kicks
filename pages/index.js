import React, {Component} from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {

    // this function is nextjs requirement for efficiency
    static getInitialProps() {    
        const campaigns = factory.methods.getDeployedCampaigns().call();
        console.log(campaigns);
        
        return { campaigns};
    }
 
    render() {
        return <div>{this.props.campaigns}</div>
    }
    
} 

export default CampaignIndex;
