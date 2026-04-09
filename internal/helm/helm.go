package helm

import (
	"fmt"
	"os/exec"
)

func Install(namespace, valuesFile string) error {
	run("helm", "repo", "add", "cnpg-console", "https://firemanxbr.github.io/cnpg-console")
	run("helm", "repo", "update")
	args := []string{"install", "cnpg-console", "cnpg-console/cnpg-console", "--namespace", namespace, "--create-namespace", "--wait"}
	if valuesFile != "" { args = append(args, "-f", valuesFile) }
	return run("helm", args...)
}

func Uninstall(namespace string) error {
	return run("helm", "uninstall", "cnpg-console", "--namespace", namespace)
}

func run(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	out, err := cmd.CombinedOutput()
	if err != nil { return fmt.Errorf("%s: %s", name, string(out)) }
	return nil
}
