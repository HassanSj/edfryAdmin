import React, { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Inject, Toolbar} from '@syncfusion/ej2-react-grids';
import { employeesData , admissionGrid } from '../data/dummy';
import { Header } from '../components';
import axios from "axios";
const Admission = () => {
  const [admission , setAdmission] = useState("")
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://edfry-backend.vercel.app/api/admission/get"
      );
      const data = response.data;
      setAdmission(data)
      console.log("DATAAAAA", admission);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='Page' title='Admissions' />
      <GridComponent dataSource={admission} allowPaging allowSorting toolbar={['Search']} width="auto">
        <ColumnsDirective>
        {admissionGrid.map((item, index) => (
          <ColumnDirective key={index} {...item} />
        ) )}
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>
    </div>
  )
}

export default Admission