/*
 * This file is part of User Dashboard.
 * Copyright (C) 2023 GEO Secretariat.
 *
 * User Dashboard is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import urlcat from "urlcat";

import { axiosInstance } from "../network";
import { GKHUB_API_URL } from "../constants";
import { AxiosInstance } from "axios";
import { BaseApiClient } from "./base";

export class VocabulariesApi extends BaseApiClient {
  constructor(apiPrefix: string, httpClient: AxiosInstance = axiosInstance) {
    super(GKHUB_API_URL, apiPrefix, httpClient);
  }

  async suggest(suggestText: string): Promise<ApiClientResponse> {
    const operationUrl = urlcat(this.apiUrl, {
      suggest: suggestText,
    });

    return this.createResponse(() => this.httpClient.get(operationUrl));
  }
}