import LanguageRangeSlider from "../inputs/LanguageRangeSlider";
import { useCallback, useEffect, useState } from "react";
import SelectIdiomas from "../inputs/SelectIdiomas";
import Button from "@/components/buttons/Button";
import { empty } from "@/assets/utils";

const CardNovoIdioma = ({ id, onChange, deleteCardFunction, options }) => {
    const [dadosNovoIdioma, setDadosNovoIdioma] = useState({
        cd_idioma: 0,
        id_leitura: 2,
        id_escrita: 2,
        id_fala: 2,
    });

    const setdadosNovoIdiomaCallback = useCallback((id, value) => {
        setDadosNovoIdioma((prevState) => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNovoIdioma);
        }
    }, [dadosNovoIdioma]);

    return (
        <div className="mb-3">
            <div className="bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1">
                Novo idioma
            </div>
            <div className="p-2 border rounded-b-lg">
                <div className="grid grid-cols-1 gap-x-2 gap-y-5 mt-2">
                    <div>
                        <SelectIdiomas
                            options={options}
                            id={`${id}_cd_idioma`}
                            label="Selecione um idioma:"
                            value={dadosNovoIdioma.cd_idioma}
                            onChange={(id, value) =>
                                setdadosNovoIdiomaCallback("cd_idioma", value)
                            }
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosNovoIdioma.id_leitura}
                            id={`${id}_leitura`}
                            label={"Leitura:"}
                            onChange={(id, value) =>
                                setdadosNovoIdiomaCallback("id_leitura", value)
                            }
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosNovoIdioma.id_escrita}
                            id={`${id}_escrita`}
                            label={"Escrita:"}
                            onChange={(id, value) =>
                                setdadosNovoIdiomaCallback("id_escrita", value)
                            }
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosNovoIdioma.id_fala}
                            id={`${id}_fala`}
                            label={"Fala:"}
                            onChange={(id, value) => setdadosNovoIdiomaCallback("id_fala", value)}
                        />
                    </div>
                    <div className="text-center">
                        <Button
                            buttonType="danger"
                            size="small"
                            onClick={() => {deleteCardFunction();}}>
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardEditIdioma = ({ dados, id, onChange, deleteCardFunction, options }) => {
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosIdioma, setDadosIdioma] = useState({
        cd_idioma: 0,
        id_leitura: 2,
        id_escrita: 2,
        id_fala: 2,
    });

    const setdadosIdiomaCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosIdioma((prevState) => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosIdioma);
        }
    }, [dadosIdioma]);

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);

        if (!empty(dados)) {
            setDadosIdioma(dados);
        }
    }, [dados]);

    return (
        <div className="mb-3">
            <div className="bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1">
                {dadosIdioma.card_title || "Idioma"}
            </div>
            <div className="border rounded-b-lg p-2">
                <div className="grid grid-cols-1 w-full gap-x-2 gap-y-5 mt-2">
                    <div>
                        <SelectIdiomas
                            options={options}
                            id={`${id}_cd_idioma`}
                            label="Selecione um idioma:"
                            value={dadosIdioma.cd_idioma}
                            onChange={(id, value) => setdadosIdiomaCallback("cd_idioma", value)}
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosIdioma.id_leitura}
                            id={`${id}_leitura`}
                            label={"Leitura:"}
                            onChange={(id, value) => setdadosIdiomaCallback("id_leitura", value)}
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosIdioma.id_escrita}
                            id={`${id}_escrita`}
                            label={"Escrita:"}
                            onChange={(id, value) => setdadosIdiomaCallback("id_escrita", value)}
                        />
                    </div>
                    <div>
                        <LanguageRangeSlider
                            value={dadosIdioma.id_fala}
                            id={`${id}_fala`}
                            label={"Fala:"}
                            onChange={(id, value) => setdadosIdiomaCallback("id_fala", value)}
                        />
                    </div>
                    <div className="text-center">
                        <Button buttonType="danger" onClick={() => {deleteCardFunction();}} size="small">
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CardNovoIdioma, CardEditIdioma };
