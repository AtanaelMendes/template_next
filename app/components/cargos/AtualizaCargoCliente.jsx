import { faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Select2CargosSip from '@/components/inputs/Select2CargosSip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import ModalGrid from "@/components/Layouts/ModalGrid";
import InputText from '@/components/inputs/InputText';
import Fieldset from '@/components/inputs/Fieldset';
import NoDataFound from "../Layouts/NoDataFound";
import Button from '@/components/buttons/Button';
import Radio from '@/components/inputs/Radio';
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";

const AtualizaCargoCliente = ({ cdPessoaCliente, cdEmpresaCliente, cdCargoCliente, className, contentclass, init, callBack, ...props }) => {
    const [dadosCargosClienteFilter, setDadosCargosClienteFilter] = useState([]);
    const [modalEditaCargoCliente, setModalEditaCargoCliente] = useState(false);
    const [dadosCargosCliente, setDadosCargosCliente] = useState([]);
    const { toast } = useAppContext();
    const [cargoSelected, setCargoSelected] = useState({});
    const [filter, setFilter] = useState({ data: "" });
    const [ready, setReady] = useState(false);
    const [cargoClienteEdit, setCargoClienteEdit] = useState({});
    const [formCargoClienteEdit, setFormCargoClienteEdit] = useState({
        cd_pessoa_cliente: "",
        cd_empresa_cliente: "",
        id_cargo_exibir_web: "",
        nm_cargo_cliente: "",
        nm_cargo: "",
        cd_cargo_cliente: "",
        cd_cargo_interno: ""
    });

    useEffect(() => {
        setFormCargoClienteEdit({
            cd_pessoa_cliente: cdPessoaCliente,
            cd_empresa_cliente: cdEmpresaCliente,
            nm_cargo_cliente: cargoClienteEdit.NM_CARGO_CLIENTE || "",
            id_cargo_exibir_web: cargoClienteEdit.ID_CARGO_EXIBIR_WEB,
            nm_cargo: cargoClienteEdit.NM_CARGO,
            cd_cargo_cliente: cargoClienteEdit.CD_CARGO_CLIENTE,
            cd_cargo_interno: cargoClienteEdit.CD_CARGO_INTERNO
        });
    }, [cargoClienteEdit]);

    useEffect(() => {
        if (typeof callBack == "function") {
            callBack(cargoSelected);
        }
    }, [cargoSelected]);

    const setFilterTextCallback = useCallback((id, value) => {
        setFilter(prevFilterVaga => ({
            ...prevFilterVaga,
            [id]: value
        }));
    }, [setFilter]);

    function getCargosCliente() {
        axiosInstance.get(`cargo/cargos-cliente/${cdPessoaCliente}/${cdEmpresaCliente}`)
            .then(function (response) {
                setDadosCargosCliente(response.data);
                setReady(true);
            }).catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(error.join(" ") || "OOps ocorreu um erro");
                }
                return toast.error(error || "OOps ocorreu um erro");
            });
    }

    function saveCargoCliente() {
        axiosInstance.put(`cargo/cliente-cargo`,
            formCargoClienteEdit
        ).then(function (response) {
            if (response.status === 200) {
                toast.success("Cargo atualizado com sucesso");
                setModalEditaCargoCliente(false);
                getCargosCliente();
            }
        }).catch(function (resp) {
            let error = resp?.response?.data?.error;
            if (Array.isArray(error)) {
                return toast.error(error.join(" ") || "OOps ocorreu um erro ao atualizar o cargo");
            }
            return toast.error(error || "OOps ocorreu um erro ao atualizar o cargo");
        });
    }

    function setFormCargoClienteEditValues(id, value) {
        setFormCargoClienteEdit({...formCargoClienteEdit, [id]: value});
    }

    function setFormCargoClienteRadioValues(id, value, checked) {
        setFormCargoClienteEdit({...formCargoClienteEdit, id_cargo_exibir_web: value});
    }

    useEffect(() => {
        if (dadosCargosCliente) {
            setDadosCargosClienteFilter(dadosCargosCliente.filter(item =>
                Object.values(item).some(v =>
                    typeof v === 'string' && v.toLowerCase().includes(filter.data.toLowerCase())
                )
            ));
        }
    }, [filter]);

    useEffect(() => {
        setDadosCargosClienteFilter(dadosCargosCliente);
    }, [dadosCargosCliente]);

    useEffect(() => {
        if (!init) return;
        if (!cdPessoaCliente || !cdEmpresaCliente) return;
        getCargosCliente();
    }, [init, cdPessoaCliente, cdEmpresaCliente]);

    function renderCargosCliente() {
        if (!dadosCargosCliente) return <NoDataFound />;
        return dadosCargosClienteFilter.map((cargo) => {
            return (
                <div
                    key={cargo.CD_CARGO_CLIENTE}
                    className={`
                        flex flex-row
                        text-sm gap-2 py-1
                        hover:bg-blue-100
                        w-full cursor-pointer
                        ${(cargo.CD_CARGO_CLIENTE == cargoSelected?.CD_CARGO_CLIENTE) ? 'bg-blue-200' : 'even:bg-white odd:bg-slate-100'}`}>
                    <div className="flex w-1/3 px-1">
                        <Radio id={`cargo_${cargo.CD_CARGO_CLIENTE}`} label={cargo.NM_CARGO_CLIENTE} checked={cargo.CD_CARGO_CLIENTE == cargoSelected?.CD_CARGO_CLIENTE} onClick={() => { setCargoSelected(cargo) }} />
                    </div>
                    <div className="flex w-1/3 px-1 items-center">
                        {cargo.NM_CARGO}
                    </div>
                    <div className="flex w-1/3  text-primary items-center px-1">
                        <div className="flex items-center cursor-pointer" onClick={() => { setCargoClienteEdit(cargo); setModalEditaCargoCliente(true); }}>
                            {cargo.DS_CARGO_EXIBIR_WEB}
                            <FontAwesomeIcon icon={faEdit} width="12" height="12" className="ml-2" />
                        </div>
                    </div>
                </div>
            );
        });
    }

    return (
        <>
            <div className={`flex flex-row flex-wrap relative border border-blue-100 rounded w-full my-2 ${className}`}>
                <div className="flex w-full flex-row-reverse p-2">
                    <div className="w-1/3">
                        <InputText id={"data"} placeholder={"Filtrar"} onChange={setFilterTextCallback} value={filter.data} clearable={true}/>
                    </div>
                </div>

                <div className="flex flex-row w-full bg-primary text-white font-semibold text-base">
                    <div className="flex w-1/3 p-1">CARGO CLIENTE</div>
                    <div className="flex w-1/3 p-1">CARGO INTERNO</div>
                    <div className="flex w-1/3 p-1">VISÍVEL WEB</div>
                </div>

                <div className={`flex flex-row w-full text-primary font-semibold p-2 items-center justify-center ${!ready ? "" : "hidden"}`}>
                    Carregando <FontAwesomeIcon icon={faSpinner} width="18" height="18" className="animate-spin ml-2" />
                </div>

                <div className={`flex flex-row flex-wrap w-full pb-10 ${contentclass}`}>
                    {renderCargosCliente()}
                </div>

                <div className="flex flex-row bg-white text-sm text-primary w-full p-0.5">
                    Exibindo {dadosCargosClienteFilter?.length || 0} registros
                </div>
            </div>

            <ModalGrid
                size="md"
                btnCancel={"CANCELAR"}
                footerClass="text-right"
                modalControl={modalEditaCargoCliente}
                setModalControl={setModalEditaCargoCliente}
                footer={<Button id="btn_save_cargo" buttonType="success" onClick={saveCargoCliente}>SALVAR</Button>}>
                <div className="col-span-12">
                    <Fieldset label="Exibir na WEB">
                        <Radio id="id_cargo_exibir_web_i" value="I" label="Cargo interno" checked={formCargoClienteEdit.id_cargo_exibir_web != "C"} onChange={setFormCargoClienteRadioValues} />
                        <Radio id="id_cargo_exibir_web_c" value="C" label="Cargo cliente" checked={formCargoClienteEdit.id_cargo_exibir_web == "C"} className="ml-2" onChange={setFormCargoClienteRadioValues} />
                    </Fieldset>
                </div>
                <div className="col-span-12">
                    <InputText label="Cargo cliente" id="nm_cargo_cliente" value={formCargoClienteEdit.nm_cargo_cliente} onChange={setFormCargoClienteEditValues}/>
                </div>
                <div className="col-span-12 h-[300px] mt-2">
                    <Select2CargosSip
                        id="cd_cargo_interno"
                        init={modalEditaCargoCliente}
                        label="Cargo SIP"
                        className="z-[99]"
                        value={{ value: formCargoClienteEdit.cd_cargo_interno, label: formCargoClienteEdit.nm_cargo }}
                        onChange={setFormCargoClienteEditValues}/>
                </div>
            </ModalGrid>
        </>
    );
}
export default AtualizaCargoCliente;