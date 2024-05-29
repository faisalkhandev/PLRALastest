import React, { Fragment, useCallback, useState } from 'react'
import { Typography, Box, Grid } from '@mui/material'
import { useTheme } from '@emotion/react'
import { InputField, SimpleDropDown, MyTableContainer, Btn } from '../../../Components/index'

const Transaction = () => {

    const theme = useTheme();

    //states
    const [formData, setFormData] = useState({
        transaction_type: "", transaction_type_abbrevation: "",
    });
    const [journalState, setJournalState] = useState("");

    // functions
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const TransactionTypes = [
        {
            "id": 1,
            "value": "build_pay",
            "label": "Build Pay"
        },
        {
            "id": 2,
            "value": "payroll_manual_transaction",
            "label": "Payroll Manual Transaction"
        },
        {
            "id": 3,
            "value": "leaves_encashment_process",
            "label": "Leaves Encashment Process"
        },
        {
            "id": 4,
            "value": "leaves_encashment_payment",
            "label": "Leaves Encashment Payment"
        },
        {
            "id": 5,
            "value": "gratuity_process",
            "label": "Gratuity Process"
        },
        {
            "id": 6,
            "value": "gratuity_payment",
            "label": "Gratuity Payment"
        },
        {
            "id": 7,
            "value": "loan_benefit_payment",
            "label": "Loan (Benefit) Payment"
        },
        {
            "id": 8,
            "value": "loan_salary_payment",
            "label": "Loan (Salary) Payment"
        },
        {
            "id": 9,
            "value": "loan_cash_payment",
            "label": "Loan (Cash) Payment"
        },
        {
            "id": 10,
            "value": "loan_settlement_benefit",
            "label": "Loan Settlement (Benefit)"
        },
        {
            "id": 11,
            "value": "loan_settlement_salary",
            "label": "Loan Settlement (Salary)"
        },
        {
            "id": 12,
            "value": "loan_settlement_cash",
            "label": "Loan Settlement (Cash)"
        },
        {
            "id": 13,
            "value": "employee_reimbursement_payment",
            "label": "Employee Reimbursement Payment"
        },
        {
            "id": 14,
            "value": "eos_process",
            "label": "EOS Process"
        },
        {
            "id": 15,
            "value": "eos_employee_payment",
            "label": "EOS Employee Payment"
        },
        {
            "id": 16,
            "value": "field_expense_management",
            "label": "Field Expense Management"
        }
    ]
    const columns = [
        {
            field: 'Create_a_Journal_Entry_Per',
            headerName: 'Journal Entry',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'per_day_salary_factor',
            headerName: 'Per Day Salary Factor',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
    ];

    const handleDropDownChange = (event, field) => {
        setJournalState(event.target.value);
        setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
    };

    const resetForm = useCallback(() => {
        setFormData({
            transaction_type: "", transaction_type_abbrevation: "",
        });
        setJournalState("")

    }, []);

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Transaction Setup</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn type="save" />
                <Btn type="delete" />
            </Box>
            <form action="">
                <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                        <SimpleDropDown name="transaction_type" label="Transaction Type" mandatory value={journalState} options={TransactionTypes} onChange={(event) => handleDropDownChange(event, "transaction_type")} type="text" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                        <InputField name="transaction_type_abbrevation" label="Transaction Type Abbrevation" mandatory value={formData.transaction_type_abbrevation} onChange={handleChange} placeholder="Enter Transaction Type Abbrevation" type="text" />
                    </Grid>
                </Grid>
            </form>
            <MyTableContainer
                columns={columns}
                data={true}
                customPageSize={10}
                RowFilterWith="id"
                outerCSS={{ mt: 4 }}
                minHeight={"calc(100vh - 330px)"}
            />
        </Fragment>
    );
}

export default Transaction;
