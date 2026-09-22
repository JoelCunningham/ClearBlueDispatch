export const configs = {
  certifications: {
    vda: process.env.VDA_CERTIFICATION_NUMBER,
    nmi: process.env.NMI_CERTIFICATION_NUMBER
  },
  contact: {
    director: {
      name: process.env.DIRECTOR_NAME,
      phone: process.env.DIRECTOR_PHONE,
      email: process.env.DIRECTOR_EMAIL
    },
    office: {
      phone: process.env.OFFICE_PHONE,
      email: process.env.OFFICE_EMAIL
    },
    abn: process.env.ABN_NUMBER,
    website: process.env.WEBSITE_URL
  }
};
