export type FormValues = {
  PAVADIN: string;
  ADRESAS: string;
  EL_PASTAS?: string;
  NUORODA?: string;
  TELEF_MOB?: string;
  TELEFONAS?: string;
  SOC_TINKL?: string;
  PASTABA?: string;
  related: {
    LO_VEIKLA?: number;
    KLASE_1_4?: number;
    KLASE_5_8?: number;
    KLASE_9_12?: number;
    NVS_KREPSE?: number;
    SPC_POREIK?: number;
    PEDAGOGAS?: string;
    PASTABA?: string;
  };
};

export type FormRelated = {
    LO_VEIKLA?: number;
    KLASE_1_4?: number;
    KLASE_5_8?: number;
    KLASE_9_12?: number;
    NVS_KREPSE?: number;
    SPC_POREIK?: number;
    PEDAGOGAS?: string;
    PASTABA?: string;
}
