import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  Button,
  VStack,
  Flex,
  SimpleGrid,
  InputLeftAddon,
  Heading,
  useDisclosure,
  CloseButton,
  Checkbox,
  HStack,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { PhoneIcon, EmailIcon, LinkIcon, DeleteIcon } from "@chakra-ui/icons";
import InputField from "../Input";
import { UpdateFeature } from "@/helpers/updateFeature";
import { DeleteFeature } from "@/helpers/deleteFeature";
import { FormValues } from "@/types/form";
import { GroupData } from "@/utils/groupData";
import { queryActivityGroupTable, queryDomains } from "@/helpers/queryDomains";

type ToastState = {
  text: string;
  status: "info" | "success" | "error";
};

export default function EditForm({ isOpen, onClose, editData, view }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    reset,
    control,
  } = useForm<FormValues>();

  useEffect(() => {
    reset(editData.attributes);
    reset((formValues) => ({
      ...formValues,
      related: {
        VEIKLAGRID:
          editData.attributes.relatedFeatures[0].attributes.VEIKLAGRID,
        VEIKLAID: editData.attributes.relatedFeatures.map((f: any) => {
          return f.attributes.VEIKLAID;
        }),
        PEDAGOGAS: editData.attributes.relatedFeatures[0].attributes.PEDAGOGAS,
        KLASE_1_4: editData.attributes.relatedFeatures[0].attributes.KLASE_1_4,
        KLASE_5_8: editData.attributes.relatedFeatures[0].attributes.KLASE_5_8,
        KLASE_9_12:
          editData.attributes.relatedFeatures[0].attributes.KLASE_9_12,
        NVS_KREPSE:
          editData.attributes.relatedFeatures[0].attributes.NVS_KREPSE,
        SPC_POREIK:
          editData.attributes.relatedFeatures[0].attributes.SPC_POREIK,
        GUID: editData.attributes.relatedFeatures[0].attributes.GUID,
        OBJECTID: editData.attributes.relatedFeatures[0].attributes.OBJECTID,
      },
    }));
  }, [editData, reset]);

  const [geometry, setGeometry] = useState<__esri.Geometry>();
  const [checkedNVS, setCheckedNVS] = useState<number | null>();
  const [activityGroup, setActivityGroup] = useState<any>();
  const [domains, setDomains] = useState<any>();
  const deleteVeiklaIds = editData?.attributes.relatedFeatures.map((f: any) => {
    return f.attributes.OBJECTID;
  });

  const [resultsText, setResultsText] = useState<ToastState>({
    text: "",
    status: "info",
  });
  const toast = useToast();

  const onSubmit = async (attributes: FormValues) => {
    const relatedAttributes = attributes.related;
    delete attributes.related;
    const results = await UpdateFeature(
      attributes,
      relatedAttributes,
      deleteVeiklaIds
    );

    if (results === "success") {
      view?.graphics.removeAll();
      setGeometry(undefined);
      setResultsText({
        text: "Objektas sėkmingai atnaujintas",
        status: "success",
      });
      onClose();
      const layer = view.map.layers.getItemAt(0);
      // @ts-ignore
      await layer.refresh();
    } else {
      setResultsText({ text: "Įvyko klaida", status: "error" });
    }
  };

  const onInvalid = () => null;

  const selectedActivities = watch("related.VEIKLAID");

  const handleCheckboxChange = (value: number | null) => {
    setCheckedNVS(value); // Update the state with the value of the checked checkbox
  };

  const watchedGroups = watch("related.VEIKLAGRID");

  useEffect(() => {
    if (!view) return;
    async function queryData() {
      const results = await queryActivityGroupTable();
      setActivityGroup(results);
      const domainsResults = await queryDomains();
      setDomains(domainsResults);
    }

    queryData();
  }, [view]);

  const filteredActivitiesData: any = useMemo(() => {
    if (!activityGroup || !domains) return [];
    const results = activityGroup.filter(
      (item: { attributes: { VEIKLAGRID: number | undefined } }) =>
        item.attributes.VEIKLAGRID === watchedGroups
    );
    // @ts-ignore
    const filteredData = domains[0].domain.codedValues.filter(
      (item: { code: number }) => {
        return results.some(
          (result: { attributes: { VEIKLAID: number } }) =>
            result.attributes.VEIKLAID === item.code
        );
      }
    );
    return filteredData;
  }, [activityGroup, domains, watchedGroups]);

  const defaultValuesActivities = useCallback(() => {
    const defaultValues = filteredActivitiesData.filter((value: any) => {
      return watch("related.VEIKLAID")?.includes(value.code);
    });
    return defaultValues;
  }, [filteredActivitiesData, watch]);

  // delete feature
  const deleteFeature = async (id: number) => {
    const results = await DeleteFeature(id);
    if (results === "success") {
      const layer = view.map.layers.getItemAt(0);
      await layer.refresh();
      view.goTo({
        target: [25.28093, 54.681],
        zoom: 13,
      });
      onClose();
    }
  };

  // show toast message on add new feature results
  useEffect(() => {
    if (resultsText.text !== "") {
      const { text, status } = resultsText;

      toast({
        description: text,
        status: status,
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  }, [resultsText, toast]);

  return (
    isOpen && (
      <VStack
        as="form"
        position="absolute"
        bottom="7"
        maxW="800px"
        w="100%"
        maxH={{ base: "450px", xl: "800px" }}
        right="3"
        bg="brand.10"
        p="4"
        shadow="md"
        rounded="md"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        align="left"
        overflow="auto"
      >
        <Heading size="md">Redaguoti objektą </Heading>
        <Text fontSize="sm" color="brand.31">
          {watch("PAVADIN")}
        </Text>
        <CloseButton position="absolute" top="0" right="0" onClick={onClose} />

        <Controller
          control={control}
          name="related.VEIKLAGRID"
          rules={{ required: "Reikalinga grupė" }}
          defaultValue={watch("related.VEIKLAGRID")}
          render={({
            field: { onChange, onBlur, name, ref },
            fieldState: { error },
          }) => (
            <FormControl py={1} isInvalid={!!error} id="food">
              <FormLabel m="0" fontSize="sm" color="brand.40">
                Grupės
              </FormLabel>

              <Select
                useBasicStyles
                selectedOptionStyle="check"
                name={name}
                ref={ref}
                onChange={(select: any) => onChange(select.value)}
                onBlur={onBlur}
                options={GroupData}
                value={GroupData.map((item) => {
                  if (item.value === watch("related.VEIKLAGRID")) {
                    return {
                      label: item.label,
                      value: item.value,
                    };
                  }
                })}
                // defaultValue={{
                //   label: GroupData[0].label,
                //   value: GroupData[0].value,
                // }}
                isSearchable={false}
              />

              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <SimpleGrid columns={[1, 2]} spacing="3">
          <InputField
            register={register}
            registerValue="PAVADIN"
            error={errors.PAVADIN && errors.PAVADIN.message}
            name="Pavadinimas"
            id="PAVADIN"
          />
          <InputField
            register={register}
            registerValue="ADRESAS"
            error={errors.ADRESAS && errors.ADRESAS.message}
            name="Adresas"
            id="ADRESAS"
          />
          <InputField
            register={register}
            registerValue="EL_PASTAS"
            error={errors.EL_PASTAS && errors.EL_PASTAS.message}
            name="El. paštas"
            id="EL_PASTAS"
          >
            <InputLeftAddon bg="brand.10">
              <EmailIcon />
            </InputLeftAddon>
          </InputField>
          <InputField
            register={register}
            registerValue="NUORODA"
            error={errors.NUORODA && errors.NUORODA.message}
            name="Nuoroda"
            id="NUORODA"
          >
            <InputLeftAddon bg="brand.10">
              <LinkIcon />
            </InputLeftAddon>
          </InputField>
          <InputField
            type="tel"
            register={register}
            registerValue="TELEF_MOB"
            error={errors.TELEF_MOB && errors.TELEF_MOB.message}
            name="Mobilaus telefono numeris"
            id="TELEF_MOB"
          >
            {/* <InputLeftAddon bg="brand.10">+370</InputLeftAddon> */}
          </InputField>
          <InputField
            register={register}
            registerValue="TELEFONAS"
            error={errors.TELEFONAS && errors.TELEFONAS.message}
            name="Telefonas"
            id="TELEFONAS"
          >
            <InputLeftAddon bg="brand.10">
              <PhoneIcon />
            </InputLeftAddon>
          </InputField>
          <InputField
            register={register}
            registerValue="SOC_TINKL"
            error={errors.SOC_TINKL && errors.SOC_TINKL.message}
            name="Socialiniai tinklai"
            id="SOC_TINKL"
          />

          <InputField
            register={register}
            registerValue="PASTABA"
            error={errors.PASTABA && errors.PASTABA.message}
            name="Pastaba"
            id="PASTABA"
          />
          <InputField
            register={register}
            registerValue={`related.${"PEDAGOGAS"}`}
            error={
              errors.related?.PEDAGOGAS && errors.related?.PEDAGOGAS.message
            }
            name="Pedagogas"
            id="PEDAGOGAS"
          />
        </SimpleGrid>
        <Controller
          control={control}
          name="related.VEIKLAID"
          //   defaultValue=""
          render={({
            field: { onChange, onBlur, name, ref },
            fieldState: { error },
          }) => (
            <FormControl py={1} isInvalid={!!error} id="veikla">
              <FormLabel m="0" fontSize="sm" color="brand.40">
                Veiklos
              </FormLabel>
              <Select
                isMulti
                useBasicStyles
                selectedOptionStyle="check"
                name={name}
                ref={ref}
                onChange={(select: any) =>
                  onChange(select.map((item: { code: number }) => item.code))
                }
                onBlur={onBlur}
                options={filteredActivitiesData}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.code}
                placeholder="Pasirinkti veiklas"
                closeMenuOnSelect={false}
                noOptionsMessage={() => "Nėra pasirinkimų"}
                value={defaultValuesActivities()}
              />

              <FormErrorMessage>
                {errors.related?.VEIKLAID && errors.related?.VEIKLAID.message}
              </FormErrorMessage>
            </FormControl>
          )}
        />
        <HStack spacing="4" mt="1">
          <Text>Klasės:</Text>
          <Checkbox
            isChecked={watch("related.KLASE_1_4") === 1}
            onChange={(e) =>
              setValue("related.KLASE_1_4", e.target.checked ? 1 : null)
            }
          >
            1-4 klasė
          </Checkbox>
          <Checkbox
            isChecked={watch("related.KLASE_5_8") === 1}
            onChange={(e) =>
              setValue("related.KLASE_5_8", e.target.checked ? 1 : null)
            }
          >
            5-8 klasė
          </Checkbox>
          <Checkbox
            isChecked={watch("related.KLASE_9_12") === 1}
            onChange={(e) =>
              setValue("related.KLASE_9_12", e.target.checked ? 1 : null)
            }
          >
            9-12 klasė
          </Checkbox>
        </HStack>
        <Flex flexDirection="row">
          <Text mr="4">Taikomas NVŠ krepšelis:</Text>
          <Checkbox
            mr="4"
            onChange={(e) => {
              setValue("related.NVS_KREPSE", e.target.checked ? 1 : null);
              handleCheckboxChange(checkedNVS === 1 ? null : 1);
            }}
            isChecked={watch("related.NVS_KREPSE") === 1}
          >
            Taip
          </Checkbox>
          <Checkbox
            onChange={(e) => {
              setValue("related.NVS_KREPSE", e.target.checked ? 2 : null);
              handleCheckboxChange(checkedNVS === 2 ? null : 2);
            }}
            isChecked={watch("related.NVS_KREPSE") === 2}
          >
            Ne
          </Checkbox>
        </Flex>
        <Flex flexDirection="row" mb="2">
          <Text mr="4">
            Priimami vaikai turintys specialiųjų ugdymo poreikių:
          </Text>
          <Checkbox
            isChecked={watch("related.SPC_POREIK") === 1}
            mr="4"
            onChange={(e) => {
              setValue("related.SPC_POREIK", e.target.checked ? 1 : null);
            }}
          >
            Taip
          </Checkbox>
          <Checkbox
            isChecked={watch("related.SPC_POREIK") === 2}
            onChange={(e) => {
              setValue("related.SPC_POREIK", e.target.checked ? 2 : null);
            }}
          >
            Ne
          </Checkbox>
        </Flex>

        <Flex justify="space-between" w="100%">
          <Popover>
            <PopoverTrigger>
              <Button
                bg="brand.20"
                fontSize="sm"
                textTransform="uppercase"
                shadow="md"
                leftIcon={<DeleteIcon />}
              >
                Ištrinti objektą
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                Ar tikrai norite ištrinti šį renginį?
              </PopoverHeader>
              <PopoverBody display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => deleteFeature(editData.attributes.OBJECTID)}
                >
                  Ištrinti
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Button
            bg="brand.30"
            fontSize="sm"
            textTransform="uppercase"
            _hover={{ bg: "brand.31" }}
            isLoading={isSubmitting}
            type="submit"
            shadow="md"
          >
            Atnaujinti
          </Button>
        </Flex>
      </VStack>
    )
  );
}
