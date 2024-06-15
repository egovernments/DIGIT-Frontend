import React, { useState } from 'react';

const DeliveryChannels = (props) => {
  const deliveryChannels = [
    {
      type: 'SMS',
      values: ['+91 9876543219', '+91 9876543218']
    },
    {
      type: 'EMAIL',
      values: ['vikram@gmail.com']
    },
    {
      type: 'POST',
      values: ['227, 5th Cross, 13th Main, Indiranagar, Bengaluru, Karnataka, 560068']
    },
    {
      type: 'POLICE',
      values: ['227, 5th Cross, 13th Main, Indiranagar, Bengaluru, Karnataka, 560068']
    }
  ];
  const [selectedChannels, setSelectedChannels] = useState([]);

  const handleCheckboxChange = (channel) => {
    setSelectedChannels((prevSelected) =>
      prevSelected.includes(channel)
        ? prevSelected.filter((c) => c !== channel)
        : [...prevSelected, channel]
    );
  };

  if(!props?.formData?.partyToSummon){
    return null
  }

  return (
    <div>
      <h3>Select delivery channels</h3>
      <form>
        {deliveryChannels.map((channel) => (
          <div key={channel.type}>
            {channel.type === 'SMS' && (
              <div>
                <h4>SMS to</h4>
                {channel.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      id={value}
                      checked={selectedChannels.includes(value)}
                      onChange={() => handleCheckboxChange(value)}
                    />
                    <label htmlFor={value}>{value}</label>
                  </div>
                ))}
              </div>
            )}
            {channel.type === 'EMAIL' && (
              <div>
                <h4>E-mail to</h4>
                <input
                  type="checkbox"
                  id={channel.value}
                  checked={selectedChannels.includes(channel.value)}
                  onChange={() => handleCheckboxChange(channel.value)}
                />
                <label htmlFor={channel.value}>{channel.value}</label>
              </div>
            )}
            {(channel.type === 'POST' || channel.type === 'POLICE') && (
              <div>
                <h4>{channel.type === 'POST' ? 'Post to' : 'Via Police to'}</h4>
                <input
                  type="checkbox"
                  id={channel.value}
                  checked={selectedChannels.includes(channel.value)}
                  onChange={() => handleCheckboxChange(channel.value)}
                />
                <label htmlFor={channel.value}>{channel.value}</label>
              </div>
            )}
          </div>
        ))}
      </form>
      <p>{selectedChannels.length} of {deliveryChannels.reduce((acc, channel) => acc + (channel.values ? channel.values.length : 1), 0)} selected</p>
    </div>
  );
};

// Example usage



export default DeliveryChannels;
