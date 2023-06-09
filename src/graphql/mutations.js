/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVendor = /* GraphQL */ `
  mutation CreateVendor(
    $input: CreateVendorInput!
    $condition: VendorConditionInput
  ) {
    createVendor(input: $input, condition: $condition) {
      id
      name
      address
      email
      phone
      contact_no
      works {
        items {
          id
          vendor_id
          customer_name
          customer_phone
          tracking_no
          car_model
          plate_no
          note
          date_time_arrived
          date_time_pickup
          status
          date_time_created
          date_time_updated
        }
        total
        previousToken
        nextToken
      }
    }
  }
`;
export const updateVendor = /* GraphQL */ `
  mutation UpdateVendor(
    $input: UpdateVendorInput!
    $condition: VendorConditionInput
  ) {
    updateVendor(input: $input, condition: $condition) {
      id
      name
      address
      email
      phone
      contact_no
      works {
        items {
          id
          vendor_id
          customer_name
          customer_phone
          tracking_no
          car_model
          plate_no
          note
          date_time_arrived
          date_time_pickup
          status
          date_time_created
          date_time_updated
        }
        total
        previousToken
        nextToken
      }
    }
  }
`;
export const deleteVendor = /* GraphQL */ `
  mutation DeleteVendor(
    $input: DeleteVendorInput!
    $condition: VendorConditionInput
  ) {
    deleteVendor(input: $input, condition: $condition) {
      id
      name
      address
      email
      phone
      contact_no
      works {
        items {
          id
          vendor_id
          customer_name
          customer_phone
          tracking_no
          car_model
          plate_no
          note
          date_time_arrived
          date_time_pickup
          status
          date_time_created
          date_time_updated
        }
        total
        previousToken
        nextToken
      }
    }
  }
`;
export const createWork = /* GraphQL */ `
  mutation CreateWork(
    $input: CreateWorkInput!
    $condition: WorkConditionInput
  ) {
    createWork(input: $input, condition: $condition) {
      id
      vendor_id
      customer_name
      customer_phone
      tracking_no
      car_model
      plate_no
      note
      date_time_arrived
      date_time_pickup
      status
      vendor {
        id
        name
        address
        email
        phone
        contact_no
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          reason
          attachments
          price
          date_time_completed
          status
          date_time_created
          date_time_updated
          work_id
        }
        total
        previousToken
        nextToken
      }
      date_time_created
      date_time_updated
    }
  }
`;
export const updateWork = /* GraphQL */ `
  mutation UpdateWork(
    $input: UpdateWorkInput!
    $condition: WorkConditionInput
  ) {
    updateWork(input: $input, condition: $condition) {
      id
      vendor_id
      customer_name
      customer_phone
      tracking_no
      car_model
      plate_no
      note
      date_time_arrived
      date_time_pickup
      status
      vendor {
        id
        name
        address
        email
        phone
        contact_no
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          reason
          attachments
          price
          date_time_completed
          status
          date_time_created
          date_time_updated
          work_id
        }
        total
        previousToken
        nextToken
      }
      date_time_created
      date_time_updated
    }
  }
`;
export const deleteWork = /* GraphQL */ `
  mutation DeleteWork(
    $input: DeleteWorkInput!
    $condition: WorkConditionInput
  ) {
    deleteWork(input: $input, condition: $condition) {
      id
      vendor_id
      customer_name
      customer_phone
      tracking_no
      car_model
      plate_no
      note
      date_time_arrived
      date_time_pickup
      status
      vendor {
        id
        name
        address
        email
        phone
        contact_no
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          reason
          attachments
          price
          date_time_completed
          status
          date_time_created
          date_time_updated
          work_id
        }
        total
        previousToken
        nextToken
      }
      date_time_created
      date_time_updated
    }
  }
`;
export const createWorkRequest = /* GraphQL */ `
  mutation CreateWorkRequest(
    $input: CreateWorkRequestInput!
    $condition: WorkRequestConditionInput
  ) {
    createWorkRequest(input: $input, condition: $condition) {
      id
      tracking_no
      title
      description
      reason
      attachments
      price
      date_time_completed
      status
      work {
        id
        vendor_id
        customer_name
        customer_phone
        tracking_no
        car_model
        plate_no
        note
        date_time_arrived
        date_time_pickup
        status
        vendor {
          id
          name
          address
          email
          phone
          contact_no
        }
        requests {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      date_time_created
      date_time_updated
      work_id
    }
  }
`;
export const updateWorkRequest = /* GraphQL */ `
  mutation UpdateWorkRequest(
    $input: UpdateWorkRequestInput!
    $condition: WorkRequestConditionInput
  ) {
    updateWorkRequest(input: $input, condition: $condition) {
      id
      tracking_no
      title
      description
      reason
      attachments
      price
      date_time_completed
      status
      work {
        id
        vendor_id
        customer_name
        customer_phone
        tracking_no
        car_model
        plate_no
        note
        date_time_arrived
        date_time_pickup
        status
        vendor {
          id
          name
          address
          email
          phone
          contact_no
        }
        requests {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      date_time_created
      date_time_updated
      work_id
    }
  }
`;
export const deleteWorkRequest = /* GraphQL */ `
  mutation DeleteWorkRequest(
    $input: DeleteWorkRequestInput!
    $condition: WorkRequestConditionInput
  ) {
    deleteWorkRequest(input: $input, condition: $condition) {
      id
      tracking_no
      title
      description
      reason
      attachments
      price
      date_time_completed
      status
      work {
        id
        vendor_id
        customer_name
        customer_phone
        tracking_no
        car_model
        plate_no
        note
        date_time_arrived
        date_time_pickup
        status
        vendor {
          id
          name
          address
          email
          phone
          contact_no
        }
        requests {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      date_time_created
      date_time_updated
      work_id
    }
  }
`;
export const createPushSubscription = /* GraphQL */ `
  mutation CreatePushSubscription(
    $input: CreatePushSubscriptionInput!
    $condition: PushSubscriptionConditionInput
  ) {
    createPushSubscription(input: $input, condition: $condition) {
      id
      vendor_id
      subscription
    }
  }
`;
export const updatePushSubscription = /* GraphQL */ `
  mutation UpdatePushSubscription(
    $input: UpdatePushSubscriptionInput!
    $condition: PushSubscriptionConditionInput
  ) {
    updatePushSubscription(input: $input, condition: $condition) {
      id
      vendor_id
      subscription
    }
  }
`;
export const deletePushSubscription = /* GraphQL */ `
  mutation DeletePushSubscription(
    $input: DeletePushSubscriptionInput!
    $condition: VendorPushSubscriptionInput
  ) {
    deletePushSubscription(input: $input, condition: $condition) {
      id
      vendor_id
      subscription
    }
  }
`;
export const notifyWorkStatus = `
  mutation NotifyWorkStatus(
    $input: NotifyWorkStatusInput!
  ) {
    notifyWorkStatus(input: $input) {
      count
    }
  }
`
