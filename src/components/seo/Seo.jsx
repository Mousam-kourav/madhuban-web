import React from "react";

const SEO = ({ schemas = [] }) => {
  return schemas.map((schema, i) => {
    return (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    );
  });
};

export default SEO;
