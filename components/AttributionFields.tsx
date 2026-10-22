import React, { useEffect, useState } from 'react';
import { getLeadSourceSnapshot } from '../lib/submitLead';

// Hidden first-party attribution fields (UTMs, gclid/gbraid/wbraid, referrer, landing page).
// Populated on mount from the visitor's own URL/referrer and first-party cookies only;
// the values also travel in the submitLead payload so every enquiry shows its source.
const AttributionFields: React.FC = () => {
  const [fields, setFields] = useState<Record<string, string>>({});
  useEffect(() => {
    setFields(getLeadSourceSnapshot());
  }, []);
  return (
    <>
      {Object.entries(fields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} readOnly />
      ))}
    </>
  );
};

export default AttributionFields;
