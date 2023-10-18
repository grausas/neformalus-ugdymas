export type FormValues = {
  PAVADIN: string;
  ADRESAS: string;
  EL_PASTAS?: string;
  NUORODA?: string;
  TELEF_MOB?: string;
  TELEFONAS?: string;
  SOC_TINKL?: string;
  PASTABA?: string;
  GlobalID?: string;
  related?: {
    VEIKLAID?: number[] | null;
    KLASE_1_4?: number | null;
    KLASE_5_8?: number | null;
    KLASE_9_12?: number | null;
    NVS_KREPSE?: number | null;
    SPC_POREIK?: number | null;
    PEDAGOGAS?: string | null;
    PASTABA?: string;
    VEIKLAGRID?: number;
    GUID?: string;
    OBJECTID?: number | null;
  };
};

export type FormRelated = {
  VEIKLAID?: number[] | null;
  KLASE_1_4?: number | null;
  KLASE_5_8?: number | null;
  KLASE_9_12?: number | null;
  NVS_KREPSE?: number | null;
  SPC_POREIK?: number | null;
  PEDAGOGAS?: string | null;
  PASTABA?: string | null;
  VEIKLAGRID?: number;
  GUID?: string;
  OBJECTID?: number | null;
};
