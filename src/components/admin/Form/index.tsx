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
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { PhoneIcon, EmailIcon, LinkIcon, AddIcon } from "@chakra-ui/icons";
import InputField from "../Input";
import SelectField from "../Select";
import { drawPoints } from "@/helpers/sketch";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { AddFeature } from "@/helpers/addFeature";
import { FormValues } from "@/types/form";
import { ActivitiesData } from "@/utils/activitiesData";
import { GroupData } from "@/utils/groupData";
import { queryActivityGroupTable, queryDomains } from "@/helpers/queryDomains";

type Props = {
  auth: any;
  view?: __esri.MapView;
};

type ToastState = {
  text: string;
  status: "info" | "success" | "error" | "warning";
};

export default function Form({ auth, view }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    reset,
    control,
  } = useForm<FormValues>();
  const [sketch, setSketch] = useState<__esri.Sketch>();
  const [geometry, setGeometry] = useState<__esri.Geometry>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkedNVS, setCheckedNVS] = useState<number | null>();
  const [activityGroup, setActivityGroup] = useState<any>();
  const [domains, setDomains] = useState<any>();
  const [resultsText, setResultsText] = useState<ToastState>({
    text: "",
    status: "info",
  });
  const toast = useToast();

  // add new features on form submit
  const onSubmit = async (attributes: FormValues) => {
    if (!geometry)
      return setResultsText({
        text: "Padėkite tašką žemėlapyje",
        status: "warning",
      });
    const relatedAttributes = attributes.related;
    delete attributes.related;
    const results = await AddFeature(attributes, geometry, relatedAttributes);
    if (results === "success") {
      view?.graphics.removeAll();
      sketch?.layer.graphics.removeAll();
      setGeometry(undefined);
      setResultsText({
        text: "Objektas sėkmingai pridėtas",
        status: "success",
      });
      reset();
      handleCheckboxChange(null);
      const layer = view?.map.layers.getItemAt(0);
      // @ts-ignore
      await layer.refresh();
    } else {
      setResultsText({ text: "Įvyko klaida", status: "error" });
    }
  };

  const onInvalid = () => null;

  const selectedValueGroup = watch("related.VEIKLAGRID");

  const handleCheckboxChange = (value: number | null) => {
    setCheckedNVS(value); // Update the state with the value of the checked checkbox
  };

  // add sketch widget to map if user is logged in
  useEffect(() => {
    const handles = new Handles();
    if (auth && view) {
      handles.add(
        reactiveUtils.when(
          () => !view.updating,
          () => {
            const getPolygons = async () => {
              const home = await drawPoints(view);
              setSketch(home);
            };

            getPolygons();
          },
          { once: true }
        )
      );
    }
    return () => handles.remove();
  }, [auth, view]);

  sketch?.on("create", function (event) {
    if (event.state === "complete") {
      if (geometry) {
        sketch.layer.graphics.remove(event.graphic);
      } else {
        setGeometry(event.graphic.geometry);
      }
    }
  });

  sketch?.on("update", function (event) {
    if (event.state === "complete") {
      setGeometry(event.graphics[0].geometry);
    }
  });

  useEffect(() => {
    // you can do async server request and fill up form
    reset({
      related: {
        VEIKLAGRID: 1,
        VEIKLAID: null,
        PEDAGOGAS: null,
        KLASE_1_4: null,
        KLASE_5_8: null,
        KLASE_9_12: null,
        NVS_KREPSE: null,
        SPC_POREIK: null,
      },
    });
  }, [reset]);

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

  // default values for veikla
  const defaultValuesActivities = useCallback(() => {
    const defaultValues = filteredActivitiesData.filter((value: any) => {
      return watch("related.VEIKLAID")?.includes(value.code);
    });
    return defaultValues;
  }, [filteredActivitiesData, watch]);

  return (
    <>
      <Button
        position="absolute"
        bg="brand.10"
        _hover={{ bg: "brand.20" }}
        shadow="md"
        right="200px"
        top="15px"
        size="md"
        onClick={isOpen ? onClose : onOpen}
        px="6"
        fontSize="sm"
        textTransform="uppercase"
      >
        <AddIcon color="brand.40" mr="1" boxSize="3" />
        Pridėti
      </Button>
      {isOpen && (
        <VStack
          as="form"
          position="absolute"
          top="20"
          right="4"
          maxW="800px"
          maxH="100%"
          bg="brand.10"
          p="4"
          shadow="md"
          rounded="md"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          align="left"
        >
          <Heading size="md">Pridėti naują objektą</Heading>
          <CloseButton
            position="absolute"
            top="0"
            right="0"
            onClick={onClose}
          />
          {/* <SelectField
            register={register}
            registerValue={`related.${"VEIKLAGRID"}`}
            options={{ valueAsNumber: true }}
            error={
              errors.related?.VEIKLAGRID && errors.related?.VEIKLAGRID.message
            }
            name="Grupės"
            id="VEIKLAGRID"
            text="Pasirinkite grupę"
            selectOptions={GroupData}
          /> */}
          <Controller
            control={control}
            name="related.VEIKLAGRID"
            defaultValue={watch("related.VEIKLAGRID")}
            rules={{ required: "Reikalinga grupė" }}
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
              maxLength={8}
              minLength={8}
            >
              <InputLeftAddon bg="brand.10">+370</InputLeftAddon>
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

            {/* <SelectField
              register={register}
              registerValue={`related.${"VEIKLAID"}`}
              options={{ valueAsNumber: true }}
              error={
                errors.related?.VEIKLAID  && errors.related?.VEIKLAID.message
              }
              name="Veiklos"
              id="VEIKLAID"
              text="Pasirinkti veiklą"
              selectOptions={filteredActivitiesData}
            /> */}
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
              onChange={(e) =>
                setValue("related.KLASE_1_4", e.target.checked ? 1 : null)
              }
              defaultChecked={watch("related.KLASE_1_4") === 1}
            >
              1-4 klasė
            </Checkbox>
            <Checkbox
              onChange={(e) =>
                setValue("related.KLASE_5_8", e.target.checked ? 1 : null)
              }
              defaultChecked={watch("related.KLASE_5_8") === 1}
            >
              5-8 klasė
            </Checkbox>
            <Checkbox
              onChange={(e) =>
                setValue("related.KLASE_9_12", e.target.checked ? 1 : null)
              }
              defaultChecked={watch("related.KLASE_9_12") === 1}
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
              }}
              isChecked={watch("related.NVS_KREPSE") === 1}
            >
              Taip
            </Checkbox>
            <Checkbox
              onChange={(e) => {
                setValue("related.NVS_KREPSE", e.target.checked ? 2 : null);
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
              mr="4"
              onChange={(e) => {
                setValue("related.SPC_POREIK", e.target.checked ? 1 : null);
              }}
              defaultChecked={watch("related.SPC_POREIK") === 1}
              isChecked={watch("related.SPC_POREIK") === 1}
            >
              Taip
            </Checkbox>
            <Checkbox
              onChange={(e) => {
                setValue("related.SPC_POREIK", e.target.checked ? 2 : null);
              }}
              defaultChecked={watch("related.SPC_POREIK") === 2}
              isChecked={watch("related.SPC_POREIK") === 2}
            >
              Ne
            </Checkbox>
          </Flex>

          <Flex justify="space-between" w="100%">
            <Button
              bg="brand.20"
              fontSize="sm"
              textTransform="uppercase"
              onClick={onClose}
              shadow="md"
            >
              Atšaukti
            </Button>
            <Button
              bg="brand.30"
              fontSize="sm"
              textTransform="uppercase"
              _hover={{ bg: "brand.31" }}
              isLoading={isSubmitting}
              type="submit"
              shadow="md"
            >
              Pridėti
            </Button>
          </Flex>
        </VStack>
      )}
    </>
  );
}
