/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVendor = /* GraphQL */ `
  query GetVendor($id: ID!) {
    getVendor(id: $id) {
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
export const listVendors = /* GraphQL */ `
  query ListVendors($filter: VendorFilterInput, $limit: Int, $token: String) {
    listVendors(filter: $filter, limit: $limit, token: $token) {
      items {
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
      total
      previousToken
      nextToken
    }
  }
`;
export const getWork = /* GraphQL */ `
  query GetWork($id: ID!) {
    getWork(id: $id) {
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
          reason
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
export const listWorks = /* GraphQL */ `
  query ListWorks($filter: WorkFilterInput, $limit: Int, $token: String) {
    listWorks(filter: $filter, limit: $limit, token: $token) {
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
          items {
            id
            tracking_no
            title
            description
            reason
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
      total
      previousToken
      nextToken
    }
  }
`;
export const getWorkRequest = /* GraphQL */ `
  query GetWorkRequest($id: ID!) {
    getWorkRequest(id: $id) {
      id
      tracking_no
      title
      description
      reason
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
export const listWorkRequests = /* GraphQL */ `
  query ListWorkRequests(
    $filter: WorkRequestFilterInput
    $limit: Int
    $token: String
  ) {
    listWorkRequests(filter: $filter, limit: $limit, token: $token) {
      items {
        id
        tracking_no
        title
        description
        reason
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
          date_time_created
          date_time_updated
        }
        date_time_created
        date_time_updated
        work_id
      }
      total
      previousToken
      nextToken
    }
  }
`;
