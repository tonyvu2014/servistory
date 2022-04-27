/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVendor = /* GraphQL */ `
  subscription OnCreateVendor {
    onCreateVendor {
      id
      name
      address
      email
      phone
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
      date_time_created
      date_time_updated
    }
  }
`;
export const onUpdateVendor = /* GraphQL */ `
  subscription OnUpdateVendor {
    onUpdateVendor {
      id
      name
      address
      email
      phone
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
      date_time_created
      date_time_updated
    }
  }
`;
export const onDeleteVendor = /* GraphQL */ `
  subscription OnDeleteVendor {
    onDeleteVendor {
      id
      name
      address
      email
      phone
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
      date_time_created
      date_time_updated
    }
  }
`;
export const onCreateWork = /* GraphQL */ `
  subscription OnCreateWork {
    onCreateWork {
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
        works {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          approval_url
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
export const onUpdateWork = /* GraphQL */ `
  subscription OnUpdateWork {
    onUpdateWork {
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
        works {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          approval_url
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
export const onDeleteWork = /* GraphQL */ `
  subscription OnDeleteWork {
    onDeleteWork {
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
        works {
          total
          previousToken
          nextToken
        }
        date_time_created
        date_time_updated
      }
      requests {
        items {
          id
          tracking_no
          title
          description
          approval_url
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
export const onCreateWorkRequest = /* GraphQL */ `
  subscription OnCreateWorkRequest {
    onCreateWorkRequest {
      id
      tracking_no
      title
      description
      approval_url
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
          date_time_created
          date_time_updated
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
export const onUpdateWorkRequest = /* GraphQL */ `
  subscription OnUpdateWorkRequest {
    onUpdateWorkRequest {
      id
      tracking_no
      title
      description
      approval_url
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
          date_time_created
          date_time_updated
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
export const onDeleteWorkRequest = /* GraphQL */ `
  subscription OnDeleteWorkRequest {
    onDeleteWorkRequest {
      id
      tracking_no
      title
      description
      approval_url
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
          date_time_created
          date_time_updated
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
