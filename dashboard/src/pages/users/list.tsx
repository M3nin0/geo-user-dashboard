/*
 * This file is part of User Dashboard.
 * Copyright (C) 2023 GEO Secretariat.
 *
 * User Dashboard is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";

import { useTable } from "@refinedev/react-table";
import { IResourceComponentsProps } from "@refinedev/core";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/chakra-ui";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Button,
  Box,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  Card,
  CardHeader,
  Text,
  CardBody,
  useColorModeValue,
  Avatar,
  ButtonGroup,
} from "@chakra-ui/react";

import { IconChevronDown } from "@tabler/icons";

import ReactCountryFlag from "react-country-flag";

import { ListPagination } from "../../components/list";
import _truncate from "lodash/truncate";

/**
 * List page for the ``Application User`` entity.
 */
export const UserListPage: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Name",
        cell: function render({ row }) {
          const name = row.original.name;
          const email = row.original.email;

          return (
            <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
              <Avatar name={name} w="50px" borderRadius="12px" me="18px" />
              <Flex direction="column">
                <Text fontSize="md" color={textColor} fontWeight="bold">
                  {name}
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                  <a href={`mailto:${email}`}>{email}</a>
                </Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: "gwp",
        accessorKey: "metadata.programmes",
        header: "GEO Programme",
        cell: function render({ getValue }) {
          const programmes = getValue<any>();

          return (
            <Menu>
              <MenuButton
                as={Button}
                variant={"outline"}
                rightIcon={<IconChevronDown />}
                size={"sm"}
                fontWeight={"normal"}
                w={"full"}
              >
                {programmes[0].tag}
              </MenuButton>
              <MenuList>
                {programmes.map((programme: any, idx: number) => (
                  <MenuItem key={idx}>{programme.name}</MenuItem>
                ))}
              </MenuList>
            </Menu>
          );
        },
      },
      {
        id: "countries",
        accessorKey: "metadata.countries",
        header: "Countries",
        cell: function render({ getValue }) {
          const countriesData = getValue<any>();

          const countries = countriesData.map((country: any, idx: number) => {
            const name = country.name;
            const tag = country.tag.toUpperCase();

            return (
              <MenuItem key={idx} _focus={{}}>
                <HStack>
                  <Box>
                    <ReactCountryFlag countryCode={tag} />
                  </Box>
                  <Box>{name}</Box>
                </HStack>
              </MenuItem>
            );
          });

          return (
            <Menu>
              <MenuButton
                as={Button}
                variant={"outline"}
                rightIcon={<IconChevronDown />}
                size={"sm"}
                w={"full"}
              >
                {countries[0]}
              </MenuButton>
              <MenuList>{countries}</MenuList>
            </Menu>
          );
        },
      },
      {
        id: "organizations",
        accessorKey: "metadata.organizations",
        header: "Organizations",
        cell: function render({ getValue }) {
          const organizations = getValue<any>();
          const firstOrganizationName = _truncate(organizations[0].name, {
            length: 25,
          });

          return (
            <Menu>
              <MenuButton
                as={Button}
                variant={"outline"}
                rightIcon={<IconChevronDown />}
                size={"sm"}
                fontWeight={"normal"}
                w={"full"}
              >
                {firstOrganizationName}
              </MenuButton>
              <MenuList overflow={"hidden"}>
                {organizations.map((organization: any, idx: number) => (
                  <MenuItem key={idx}>{organization.name}</MenuItem>
                ))}
              </MenuList>
            </Menu>
          );
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <ButtonGroup size={"sm"}>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
              <DeleteButton hideText recordItemId={getValue() as string} />
            </ButtonGroup>
          );
        },
      },
    ],
    [],
  );

  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQueryResult: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      meta: {
        populate: "*",
      },
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }));

  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Flex direction={"column"}>
      <Card>
        <CardHeader p="6px 0px 22px 0px">
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            marginLeft="20px"
            marginRight={"20px"}
            marginTop="20px"
          >
            <Text fontSize="xx-large" color={textColor} fontWeight="bold">
              Application Users
            </Text>
            <CreateButton />
          </Flex>
        </CardHeader>
        <CardBody overflowX={{ sm: "scroll", md: "scroll", xl: "hidden" }}>
          <Table variant="simple" color={textColor}>
            <Thead>
              {getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} my=".8rem" pl="0px" color="gray.400">
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} maxWidth={"15em"}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <ListPagination
            current={current}
            pageCount={pageCount}
            setCurrent={setCurrent}
          />
        </CardBody>
      </Card>
    </Flex>
  );
};
