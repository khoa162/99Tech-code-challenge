import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { TokenWithIcon } from '../../types/token';
import { Input } from '../elements/Input';

interface TokenSelectProps {
  tokens: TokenWithIcon[];
  selectedToken: TokenWithIcon | null;
  onChange: (token: TokenWithIcon) => void;
  label: string;
  disabled?: boolean;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  selectedToken,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <Listbox value={selectedToken} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {selectedToken ? (
              <div className="flex items-center">
                <img
                  src={selectedToken.iconUrl}
                  alt={selectedToken.currency}
                  className="h-6 w-6 mr-2"
                />
                <span className="dark:text-white">{selectedToken.currency}</span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Select a token</span>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {tokens.map((token) => (
                <Listbox.Option
                  key={token.currency}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active 
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`
                  }
                  value={token}
                >
                  {({ selected }) => (
                    <div className="flex items-center">
                      <img
                        src={token.iconUrl}
                        alt={token.currency}
                        className="h-6 w-6 mr-2"
                      />
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {token.currency}
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}; 