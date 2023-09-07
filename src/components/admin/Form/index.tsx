"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  VStack,
  Flex,
  SimpleGrid,
  InputLeftAddon,
  Heading,
  useDisclosure,
  CloseButton,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon, LinkIcon } from "@chakra-ui/icons";
import InputField from "../Input";
import SelectField from "../Select";
import { drawPoints } from "@/helpers/sketch";
import Handles from "@arcgis/core/core/Handles.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { AddFeature } from "@/helpers/addFeature";
import { FormValues } from "@/types/form";
import { CategoryData } from "@/utils/categoryData";

type Props = {
  auth: any;
  view?: __esri.MapView;
};

export default function Form({ auth, view }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const [sketch, setSketch] = useState<__esri.Sketch>();
  const [geometry, setGeometry] = useState<__esri.Geometry>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onSubmit = async (attributes: FormValues) => {
    console.log("attributes", attributes);
    if (!geometry) return console.log("error nera geometrijos");
    const relatedAttributes = attributes.related;
    // const results = await AddFeature(attributes, geometry, relatedAttributes);
    // console.log("results", results);
  };
  const onInvalid = () => null;

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
      setGeometry(event.graphic.geometry);
    }
  });

  return (
    <>
      <Button
        position="absolute"
        bg="brand.30"
        _hover={{ bg: "brand.31" }}
        shadow="md"
        right="4"
        top="20"
        size="sm"
        onClick={onOpen}
      >
        Užpildyti formą
      </Button>
      {isOpen && (
        <VStack
          as="form"
          position="absolute"
          top="20"
          right="4"
          maxW="600px"
          maxH="500px"
          bg="brand.10"
          p="4"
          shadow="md"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          align="left"
        >
          <Heading size="md">Pridėti naują veiklą</Heading>
          <CloseButton
            position="absolute"
            top="0"
            right="0"
            onClick={onClose}
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
              register={register}
              registerValue="TELEF_MOB"
              error={errors.TELEF_MOB && errors.TELEF_MOB.message}
              name="Mobilaus telefono numeris"
              id="TELEF_MOB"
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

            <SelectField
              register={register}
              registerValue={`related.${"LO_VEIKLA"}`}
              options={{ valueAsNumber: true }}
              error={
                errors.related?.LO_VEIKLA && errors.related?.LO_VEIKLA.message
              }
              name="Veiklos"
              id="LO_VEIKLA"
              selectOptions={CategoryData}
            />
          </SimpleGrid>
          <Flex justify="space-between" w="100%">
            <Button
              bg="brand.20"
              fontSize="sm"
              textTransform="uppercase"
              onClick={onClose}
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
            >
              Pridėti
            </Button>
          </Flex>
        </VStack>
      )}
    </>
  );
}
