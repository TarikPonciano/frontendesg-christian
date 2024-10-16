// esg-frontend/src/components/PermissoesConfig.js

import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const PermissoesConfig = ({ permissions, onChange }) => {
  const handlePermissionChange = (userType, menu) => {
    onChange(userType, menu, !permissions[userType][menu]);
  };

  return (
    <div>
      {Object.entries(permissions).map(([userType, menus]) => (
        <div key={userType}>
          <h2>{userType}</h2>
          <FormGroup>
            {Object.entries(menus).map(([menu, access]) => (
              <FormControlLabel
                control={<Checkbox checked={access} onChange={() => handlePermissionChange(userType, menu)} />}
                label={menu.replace(/_/g, ' ')}
                key={menu}
              />
            ))}
          </FormGroup>
        </div>
      ))}
    </div>
  );
};

export default PermissoesConfig;
