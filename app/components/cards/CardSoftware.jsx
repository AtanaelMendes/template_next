import SoftwareRangeSlider from "../inputs/SoftwareRangeSlider";
import { useCallback, useEffect, useState } from "react";
import SelectSoftwares from "../inputs/SelectSoftwares";
import Button from '@/components/buttons/Button';
import { empty } from "@/assets/utils";

const CardNovoSoftware = ({ id, onChange, deleteCardFunction, options }) => {
    const [dadosNovoSoftware, setDadosNovoSoftware] = useState({
        cd_conhecimento: 0,
        id_conhecimento: 1,
    });

    const setdadosNovoSoftwareCallback = useCallback((id, value) => {
        setDadosNovoSoftware(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNovoSoftware);
        }
    }, [dadosNovoSoftware]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                Novo software
            </div>
            <div className={"py-2 border rounded-b-lg"}>
                <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-2">
                    <div className={`col-span-1 md:col-span-4 flex items-center justify-center mb-2`}>
                        <div className="w-full px-2">
                            <SelectSoftwares
                                options={options}
                                id={`${id}_cd_conhecimento`}
                                label="Selecione um software:"
                                value={dadosNovoSoftware.cd_conhecimento}
                                onChange={(id, value) => setdadosNovoSoftwareCallback('cd_conhecimento', value)}
                            />
                        </div>
                    </div>
                    <div className={`col-span-1 md:col-span-6`}>
                        <SoftwareRangeSlider value={dadosNovoSoftware.id_conhecimento} id={`${id}_id_conhecimento`} label={"Conhecimento:"} onChange={(id, value) => setdadosNovoSoftwareCallback('id_conhecimento', value)} />
                    </div>
                    <div className={`col-span-1 md:col-span-2 flex items-center justify-center`}>
                        <Button buttonType="danger" size="small" onClick={() => { deleteCardFunction() }}>
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardEditSoftware = ({ dados, id, onChange, deleteCardFunction, options }) => {
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosSoftware, setDadosSoftware] = useState({
        cd_conhecimento: 0,
        id_conhecimento: 1,
    });

    const setdadosSoftwareCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosSoftware(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosSoftware);
        }
    }, [dadosSoftware]);

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);

        if (!empty(dados)) {
            setDadosSoftware(dados);
        }
    }, [dados]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                {dadosSoftware.card_title || "Software"}
            </div>
            <div className={"py-2 border rounded-b-lg"}>
                <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-2">
                    <div className={`col-span-1 md:col-span-4 flex items-center justify-center mb-8`}>
                        <div className="w-full px-2">
                            <SelectSoftwares
                                options={options}
                                id={`${id}_cd_conhecimento`}
                                label="Selecione um software:"
                                value={dadosSoftware.cd_conhecimento}
                                onChange={(id, value) => setdadosSoftwareCallback('cd_conhecimento', value)}
                            />
                        </div>
                    </div>
                    <div className={`col-span-1 md:col-span-6 px-4`}>
                        <SoftwareRangeSlider value={dadosSoftware.id_conhecimento} id={`${id}_id_conhecimento`} label={"Conhecimento:"} onChange={(id, value) => setdadosSoftwareCallback('id_conhecimento', value)} />
                    </div>
                    <div className={`col-span-1 md:col-span-2 flex items-center justify-center`}>
                        <Button buttonType="danger" outline bordered size="small" className={"h-8 self-center mr-1 px-1 py-1"} onClick={() => { deleteCardFunction() }}>
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CardNovoSoftware, CardEditSoftware };